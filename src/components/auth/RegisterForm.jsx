import { useState } from "react";

export default function RegisterForm({ onRegister }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !password) return;

    onRegister({
      name,
      email,
      password,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-3/4 space-y-4"
    >
      <h1 className="text-3xl font-bold mb-6">
        Get Started With
      </h1>

      <input
        type="text"
        placeholder="User Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-3 py-2 bg-gray-200 rounded-xl outline-none"
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-3 bg-gray-200 rounded-xl outline-none"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-3 bg-gray-200 rounded-xl outline-none"
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-xl"
      >
        Register
      </button>
    </form>
  );
}