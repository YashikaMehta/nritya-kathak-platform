import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { BookOpen, Menu, Search, ShieldCheck, UserCircle, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    setSearchInput(""); setMobileOpen(false);
  };

  const navLinks = [
    { to: "/explore", label: "Explore Archive" },
    { to: "/history", label: "History" },
    { to: "/gharanas", label: "Gharanas" },
    { to: "/taal-terminology", label: "Taal & Glossary" },
    { to: "/compositions", label: "Compositions" },
    { to: "/artists", label: "Artists & Gurus" },
    { to: "/events", label: "Events" },
    { to: "/community", label: "Community" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-ivory/95 backdrop-blur border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-crimson-700 text-amber-100 flex items-center justify-center shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display text-2xl font-bold tracking-wide text-crimson-800 block leading-none">NRITYA</span>
              <span className="text-[10px] uppercase tracking-widest text-stone-500 block mt-0.5">Kathak Archive</span>
            </div>
          </Link>

          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => `px-2.5 py-1.5 rounded-md text-sm font-medium transition-colors ${isActive ? "bg-crimson-700 text-white" : "text-stone-700 hover:bg-parchment hover:text-crimson-800"}`}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2.5">
            <form onSubmit={handleQuickSearch} className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search teentaal, gharana, guru..." className="pl-9 pr-3 py-1.5 w-52 lg:w-60 text-sm bg-white border border-stone-300 rounded-full focus:outline-none focus:border-crimson-700" />
            </form>

            {user ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Link to="/admin" className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-md bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200">
                    <ShieldCheck className="w-3.5 h-3.5" /> Admin
                  </Link>
                )}
                <Link to="/dashboard" className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md bg-parchment text-stone-800 hover:bg-stone-200/70">
                  <UserCircle className="w-4 h-4 text-crimson-700" />
                  <span className="max-w-[100px] truncate">{user.full_name.split(" ")[0]}</span>
                </Link>
                <button onClick={logout} className="text-xs text-stone-500 hover:text-crimson-700 px-2 py-1">Sign out</button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm font-medium text-stone-700 hover:text-crimson-700 px-2.5 py-1.5">Sign in</Link>
                <Link to="/register" className="text-sm font-medium bg-crimson-700 text-white px-3.5 py-1.5 rounded-md hover:bg-crimson-800">Join</Link>
              </div>
            )}
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="xl:hidden p-2 rounded-md text-stone-700 hover:bg-parchment" aria-label="Toggle Menu">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="xl:hidden bg-ivory border-t border-stone-200 px-4 py-4 space-y-3">
          <form onSubmit={handleQuickSearch} className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search archive..." className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-stone-300 rounded-lg" />
          </form>
          <div className="grid grid-cols-2 gap-1.5">
            {navLinks.map((item) => (
              <NavLink key={item.to} to={item.to} onClick={() => setMobileOpen(false)} className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium ${isActive ? "bg-crimson-700 text-white" : "text-stone-700 hover:bg-parchment"}`}>
                {item.label}
              </NavLink>
            ))}
          </div>
          <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="text-sm font-semibold text-crimson-700">My Dashboard</Link>
                {isAdmin && <Link to="/admin" onClick={() => setMobileOpen(false)} className="text-sm font-semibold text-amber-800">Admin Panel</Link>}
                <button onClick={() => { logout(); setMobileOpen(false); }} className="text-sm text-stone-500">Sign out</button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-stone-700">Sign in</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="text-sm font-medium bg-crimson-700 text-white px-3 py-1 rounded">Create Account</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
