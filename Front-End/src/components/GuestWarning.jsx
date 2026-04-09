import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function GuestWarning() {
    const { user } = useAuth();
    if (user) return null;

    return(
        <div className="flex justify-center mt-4 px-4">
            <motion.div 
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-yellow-100/90 backdrop-blur-sm rounded-xl border border-yellow-400 text-yellow-800 px-4 py-2 text-center text-sm font-medium sm:text-base">
                ⚠️ You are using Chrona as a guest.<br /><Link to="/auth" className="font-semibold underline hover:text-blue-700 transition">Sign in</Link> to securely save your tasks and access them anywhere.
            </motion.div>
        </div>
    );
}