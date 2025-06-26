import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { apiPost } from "../../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await apiPost("/auth/register", { email, password });
    if (res.token) {
      login(res.token);
      navigate("/dashboard");
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-tr from-gray-800 to-gray-900 shadow-xl rounded-xl p-8 w-full max-w-md space-y-6 border border-gray-700"
      >
        <h2 className="text-3xl font-bold text-white text-center">Register</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
        />

        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition duration-300"
        >
          Register
        </button>

        <p className="text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
