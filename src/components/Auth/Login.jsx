import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { apiPost } from "../../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await apiPost("/auth/login", { email, password });
    if (res.token) {
      login(res.token);
      navigate("/dashboard");
    } else {
      alert(res.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-tr from-gray-800 to-gray-900 shadow-xl rounded-xl p-8 w-full max-w-md space-y-6 border border-gray-700"
      >
        <h2 className="text-3xl font-bold text-white text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition duration-300"
        >
          Login
        </button>

        <p className="text-center text-gray-400 text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
