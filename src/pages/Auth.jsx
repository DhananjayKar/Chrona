import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import AuthOverlay from "../components/auth/AuthOverlay";

export default function Auth() {
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();
  const { login, register, user } = useAuth();
  const location = useLocation();

  if (user) {
    return <Navigate to={location.state?.from || "/"} replace />;
  }

  const handleLogin = async (email, password) => {
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate(location.state?.from || "/", { replace: true });
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleRegister = async (data) => {
    try {
      await register(data);
      toast.success("Welcome to Chrona!");
      navigate(location.state?.from || "/", { replace: true });
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">

      {/* ================= MOBILE UI ================= */}
      <div className="md:hidden relative min-h-screen flex items-center justify-center px-4 w-full max-w-md py-12 overflow-x-hidden">

        {/* animated blobs */}
        <div className="absolute w-72 h-72 bg-white/20 rounded-full blur-3xl top-10 left-[-80px] animate-pulse"></div>
        <div className="absolute w-72 h-72 bg-white/20 rounded-full blur-3xl bottom-10 right-[-80px] animate-pulse"></div>

        {/* auth card */}
        <div className="relative w-full max-w-sm backdrop-blur-lg bg-blue-200 border border-blue-400 rounded-3xl shadow-2xl min-h-[420px] p-8 animate-[fadeIn_0.6s_ease]">
          
          {isRegister ? (
            <RegisterForm onRegister={handleRegister}/>
          ) : (
            <LoginForm onLogin={handleLogin}/>
          )}

          <p className="text-center text-sm mt-6 text-gray-700">
            {isRegister ? "Already have an account?" : "Don't have an account?"}

            <button
              onClick={() => setIsRegister(!isRegister)}
              className="ml-1 font-semibold text-blue-700 hover:underline"
            >
              {isRegister ? "Sign in" : "Register for free"}
            </button>
          </p>

        </div>

      </div>

      {/* ================= DESKTOP UI ================= */}
      <div className="hidden md:flex relative w-[900px] max-w-full h-[550px] bg-white rounded-3xl shadow-xl overflow-hidden">

        <div className="absolute inset-0 flex">
          <div
            className={`w-1/2 flex items-center justify-center transition-all duration-500 ${
              isRegister
                ? "-translate-x-full opacity-0"
                : "translate-x-0 opacity-100"
            }`}
          >
            <LoginForm onLogin={handleLogin} />
          </div>

          <div
            className={`w-1/2 flex items-center justify-center transition-all duration-500 ${
              isRegister
                ? "translate-x-0 opacity-100"
                : "translate-x-full opacity-0"
            }`}
          >
            <RegisterForm onRegister={handleRegister} />
          </div>
        </div>

        <AuthOverlay isRegister={isRegister} setIsRegister={setIsRegister} />

      </div>
    </div>
  );
}