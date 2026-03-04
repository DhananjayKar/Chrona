import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import AuthOverlay from '../components/auth/AuthOverlay';

export default function Auth() {
    const [isRegister, setIsRegister ] = useState(false);
    const navigate = useNavigate();
    const { login, register } = useAuth();

    const handleLogin = (email, password) => {
        try {
            login(email, password);
            console.log(login(email, password));
            toast.success("Welcome back!");
            navigate("/");
        }
        catch (err) {
            toast.error (err.message);
        }
    };

    const handleRegister = (data) => {
        try {
            register(data);
            toast.success("Welcome to Chrona!");
            navigate("/");
        } catch (err) {
            toast.error(err.message);
        }
    };

    return(
        <div className="min-h-screen flex items-center justify-center bg-blue-50">
            <div className="relative w-[900px] max-w-full h-[550px] bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="absolute inset-0 flex">
                    <div className={`w-1/2 flex items-center justify-center transition-all duration-500 ${isRegister? "-translate-x-full opacity-0":"translate-x-0 opacity-100"}`}>
                        <LoginForm onLogin={handleLogin} />
                    </div>
                    <div className={`w-1/2 flex items-center justify-center transition-all duration-500 ${isRegister? "translate-x-0 opacity-100":"translate-x-full opacity-0"}`}>
                        <RegisterForm onRegister={handleRegister} />
                    </div>
                </div>

                <AuthOverlay isRegister={isRegister} setIsRegister={setIsRegister} />
            </div>
        </div>
    );
}