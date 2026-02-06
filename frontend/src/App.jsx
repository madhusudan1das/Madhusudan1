import ForgotPasswordPage from "./pages/ForgotPasswordPage";

// ... existing imports

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
