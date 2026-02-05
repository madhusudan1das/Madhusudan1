import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "https://chatify-backend-rmhf.onrender.com/api",
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  // Why fallback? Because cookies are fragile cross-site.
  // We attach the token to the header as a Plan B.
  const authUser = JSON.parse(localStorage.getItem("auth-storage") || "{}")?.state?.authUser;
  if (authUser?.token) {
    config.headers.Authorization = `Bearer ${authUser.token}`;
  }
  return config;
});
