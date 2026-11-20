import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await register(email, password, fullName);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Registration failed.");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="archival-card p-8">
        <h1 className="font-display text-3xl font-bold text-stone-900">Join the NRITYA Community</h1>
        <p className="text-xs text-stone-500 mt-1">Create a learner or educator profile to bookmark lessons and contribute notes.</p>
        {error && <div className="mt-4 p-3 rounded bg-red-50 text-red-800 text-xs">{error}</div>}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">Full Name</label>
            <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-3 py-2 text-sm border border-stone-300 rounded-md" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 text-sm border border-stone-300 rounded-md" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">Password (min 8 characters)</label>
            <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 text-sm border border-stone-300 rounded-md" />
          </div>
          <button type="submit" className="w-full py-2.5 rounded-lg bg-crimson-700 text-white text-sm font-semibold hover:bg-crimson-800">Create Account</button>
        </form>
        <p className="text-xs text-stone-600 mt-5 text-center">
          Already registered? <Link to="/login" className="font-semibold text-crimson-700 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
