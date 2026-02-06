import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "https://chatify-backend-rmhf.onrender.com";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      authUser: null,
      isCheckingAuth: true,
      isSigningUp: false,
      isLoggingIn: false,
      isVerifyingEmail: false,
      socket: null,
      onlineUsers: [],

      checkAuth: async () => {
        try {
          // Keep the token! Don't overwrite it with the profile check which lacks it.
          const token = get().authUser?.token;
          const res = await axiosInstance.get("/auth/check");
          set({ authUser: { ...res.data, token } });
          get().connectSocket();
        } catch (error) {
          console.log("Error in authCheck:", error);
          // Only clear auth if strictly unauthorized or 404 (user deleted)
          if (error.response?.status === 401 || error.response?.status === 404) {
            set({ authUser: null });
          }
        } finally {
          set({ isCheckingAuth: false });
        }
      },

      signup: async (data) => {
        set({ isSigningUp: true });
        try {
          const res = await axiosInstance.post("/auth/signup", data);
          // set({ authUser: res.data }); // Don't log in yet
          set({ isVerifyingEmail: true });
          toast.success("Account created! Please verify your email.");
          // get().connectSocket(); // Don't connect socket yet
        } catch (error) {
          toast.error(error.response?.data?.message || error.message || "Signup failed");
        } finally {
          set({ isSigningUp: false });
        }
      },

      login: async (data) => {
        set({ isLoggingIn: true });
        console.log("Attempting login with:", data);
        try {
          const res = await axiosInstance.post("/auth/login", data);
          console.log("Login success, response:", res.data);
          set({ authUser: res.data });

          toast.success("Logged in successfully");

          get().connectSocket();
        } catch (error) {
          console.error("Login failed:", error);
          toast.error(error.response?.data?.message || error.message || "Login failed");
        } finally {
          set({ isLoggingIn: false });
        }
      },

      logout: async () => {
        try {
          await axiosInstance.post("/auth/logout");
          set({ authUser: null });
          toast.success("Logged out successfully");
          get().disconnectSocket();
        } catch (error) {
          toast.error("Error logging out");
          console.log("Logout error:", error);
        }
      },

      updateProfile: async (data) => {
        try {
          const res = await axiosInstance.put("/auth/update-profile", data);
          // Keep the token!
          set({ authUser: { ...res.data, token: get().authUser.token } });
          toast.success("Profile updated successfully");
        } catch (error) {
          console.log("Error in update profile:", error);
          toast.error(error.response?.data?.message || error.message || "Profile update failed");
        }
      },

      verifyEmail: async (data) => {
        set({ isSigningUp: true }); // reuse loading state or create new one
        try {
          const res = await axiosInstance.post("/auth/verify-email", data);
          set({ authUser: res.data, isVerifyingEmail: false });
          toast.success("Email verified successfully!");
          get().connectSocket();
        } catch (error) {
          toast.error(error.response?.data?.message || error.message || "Verification failed");
        } finally {
          set({ isSigningUp: false });
        }
      },

      resendOtp: async (email) => {
        try {
          await axiosInstance.post("/auth/resend-otp", { email });
          toast.success("OTP resent successfully!");
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to resend OTP");
        }
      },

      forgotPassword: async (email) => {
        try {
          await axiosInstance.post("/auth/forgot-password", { email });
          toast.success("Password reset OTP sent to your email");
          return true;
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to send reset email");
          return false;
        }
      },

      resetPassword: async (data) => {
        try {
          await axiosInstance.post("/auth/reset-password", data);
          toast.success("Password reset successfully! Please login.");
          return true;
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to reset password");
          return false;
        }
      },

      connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
          auth: {
            token: authUser.token,
          },
          query: {
            userId: authUser._id,
          },
          withCredentials: true, // this ensures cookies are sent with the connection
        });

        socket.connect();

        set({ socket });

        // listen for online users event
        socket.on("getOnlineUsers", (userIds) => {
          set({ onlineUsers: userIds });
        });
      },

      disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ authUser: state.authUser }), // only save authUser
    }
  )
);
