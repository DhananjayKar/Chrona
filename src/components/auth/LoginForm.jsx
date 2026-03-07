import { useState } from "react";

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await onLogin(email, password);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full md:w-3/4 space-y-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center md:text-left">
        Login
      </h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-3 bg-white/70 md:bg-gray-200 rounded-xl outline-none"
      />

      {/* PASSWORD FIELD */}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 pr-12 bg-white/70 md:bg-gray-200 rounded-xl outline-none"
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600"
        >
          {showPassword ? <img src="/icons/eye.gif" alt="Show Password" className="w-6 h-6" /> : <img src="/icons/sleep.gif" alt="Hide Password" className="w-6 h-6" />}
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-60"
      >
        {loading ? "Logging in..." : "Sign In"}
      </button>
    </form>
  );
}