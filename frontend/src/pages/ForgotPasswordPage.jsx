import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import { MailIcon, LockIcon, ArrowLeft, LoaderIcon, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function ForgotPasswordPage() {
    const navigate = useNavigate();
    const { forgotPassword, resetPassword } = useAuthStore();

    const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password, 3: Success
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        const success = await forgotPassword(email);
        setLoading(false);
        if (success) setStep(2);
    };

    const handleReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        const success = await resetPassword({ email, otp, newPassword });
        setLoading(false);
        if (success) {
            setStep(3);
            setTimeout(() => navigate("/login"), 3000);
        }
    };

    return (
        <div className="w-full flex items-center justify-center p-4 bg-slate-900 min-h-screen">
            <div className="relative w-full max-w-md">
                <BorderAnimatedContainer>
                    <div className="w-full p-8 bg-slate-900/50 backdrop-blur-md">

                        {/* BACK BUTTON */}
                        {step !== 3 && (
                            <Link to="/login" className="flex items-center text-slate-400 hover:text-white mb-6 transition-colors">
                                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
                            </Link>
                        )}

                        {/* HEADER */}
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-slate-200 mb-2">
                                {step === 1 && "Reset Password"}
                                {step === 2 && "Verify & Set Password"}
                                {step === 3 && "Success!"}
                            </h2>
                            <p className="text-slate-400 text-sm">
                                {step === 1 && "Enter your email to receive a reset code"}
                                {step === 2 && "Check your email for the code"}
                                {step === 3 && "Your password has been reset successfully"}
                            </p>
                        </div>

                        {/* STEP 1: EMAIL */}
                        {step === 1 && (
                            <form onSubmit={handleSendOtp} className="space-y-6">
                                <div>
                                    <label className="auth-input-label">Email Address</label>
                                    <div className="relative">
                                        <MailIcon className="auth-input-icon" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="input"
                                            placeholder="you@example.com"
                                            required
                                        />
                                    </div>
                                </div>
                                <button className="auth-btn" type="submit" disabled={loading}>
                                    {loading ? <LoaderIcon className="w-5 h-5 animate-spin mx-auto" /> : "Send Reset Code"}
                                </button>
                            </form>
                        )}

                        {/* STEP 2: OTP & NEW PASSWORD */}
                        {step === 2 && (
                            <form onSubmit={handleReset} className="space-y-6">
                                <div>
                                    <label className="auth-input-label">OTP Code</label>
                                    <div className="relative">
                                        <LockIcon className="auth-input-icon" />
                                        <input
                                            type="text"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            className="input text-center tracking-widest"
                                            placeholder="••••••"
                                            maxLength={6}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="auth-input-label">New Password</label>
                                    <div className="relative">
                                        <LockIcon className="auth-input-icon" />
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="input"
                                            placeholder="Min 6 characters"
                                            minLength={6}
                                            required
                                        />
                                    </div>
                                </div>

                                <button className="auth-btn" type="submit" disabled={loading}>
                                    {loading ? <LoaderIcon className="w-5 h-5 animate-spin mx-auto" /> : "Reset Password"}
                                </button>
                            </form>
                        )}

                        {/* STEP 3: SUCCESS */}
                        {step === 3 && (
                            <div className="text-center py-8">
                                <CheckCircle className="w-16 h-16 text-cyan-400 mx-auto mb-4 animate-bounce" />
                                <p className="text-slate-300">Redirecting to login...</p>
                            </div>
                        )}

                    </div>
                </BorderAnimatedContainer>
            </div>
        </div>
    );
}

export default ForgotPasswordPage;
