import { useState } from "react";

export default function LoginForm ({ onLogin }) {
    const [email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(email, password);
    };

    return (
        <form className="w-3/4 space-y-4" onSubmit={handleSubmit}>
            <h1 className="text-3xl font-bold mb-6">Login With</h1>
            <input type="email" placeholder="Email" value={email} 
            onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-gray-200 rounded-xl outline-none" />
            <input type="password" placeholder="Password" value={password}
             onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-gray-200 rounded-xl outline-none" />
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl">Login</button>
        </form>
    );
}