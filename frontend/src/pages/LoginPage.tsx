import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Invalid credentials.");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="archival-card p-8">
        <h1 className="font-display text-3xl font-bold text-stone-900">Sign In to NRITYA</h1>
        <p className="text-xs text-stone-500 mt-1">Access your bookmarks, practitioner profile, and archival submissions.</p>
        {error && <div className="mt-4 p-3 rounded bg-red-50 text-red-800 text-xs">{error}</div>}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 text-sm border border-stone-300 rounded-md" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 text-sm border border-stone-300 rounded-md" />
          </div>
          <button type="submit" className="w-full py-2.5 rounded-lg bg-crimson-700 text-white text-sm font-semibold hover:bg-crimson-800">Sign In</button>
        </form>
        <p className="text-xs text-stone-600 mt-5 text-center">
          New to NRITYA? <Link to="/register" className="font-semibold text-crimson-700 hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
