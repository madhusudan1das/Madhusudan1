import { Navigate, Route, Routes } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import PageLoader from "./components/PageLoader";

import { Toaster } from "react-hot-toast";

function App() {
  // ... existing code

  return (
    <div className="min-h-screen bg-slate-900 relative flex items-center justify-center p-0 sm:p-4 overflow-hidden">
      {/* ... existing decorators */}

      <Routes>
        <Route path="/" element={authUser ? <ChatPage /> : <Navigate to={"/login"} />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to={"/"} />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />} />
        <Route path="/forgot-password" element={!authUser ? <ForgotPasswordPage /> : <Navigate to={"/"} />} />
      </Routes>

      <Toaster />
    </div>
  );
}
export default App;
