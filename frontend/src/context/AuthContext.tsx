import React, { createContext, useContext, useEffect, useState } from "react";
import apiClient from "../api/client";
import { User } from "../types";

interface AuthContextType {
  user: User | null; token: string | null; loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, full_name: string) => Promise<void>;
  logout: () => void; refreshUser: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("nritya_token"));
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    const storedToken = localStorage.getItem("nritya_token");
    if (!storedToken) { setUser(null); setLoading(false); return; }
    try {
      const res = await apiClient.get<User>("/auth/me");
      setUser(res.data);
    } catch {
      localStorage.removeItem("nritya_token");
      setToken(null); setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refreshUser(); }, []);

  const login = async (email: string, password: string) => {
    const res = await apiClient.post("/auth/login", { email, password });
    localStorage.setItem("nritya_token", res.data.access_token);
    setToken(res.data.access_token); setUser(res.data.user);
  };

  const register = async (email: string, password: string, full_name: string) => {
    const res = await apiClient.post("/auth/register", { email, password, full_name });
    localStorage.setItem("nritya_token", res.data.access_token);
    setToken(res.data.access_token); setUser(res.data.user);
  };

  const logout = () => { localStorage.removeItem("nritya_token"); setToken(null); setUser(null); };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshUser, isAdmin: user?.role?.name === "admin" }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
