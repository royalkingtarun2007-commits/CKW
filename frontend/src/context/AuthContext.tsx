import React, { createContext, useEffect, useState } from "react";
import {
  fetchUserProfile,
  loginUser,
  updateUserProfile,
} from "../api/auth";

import type { User } from "../types/User";
import toast from "react-hot-toast";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<User>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  updateUser: async () => {
    throw new Error("not implemented");
  },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [loading, setLoading] = useState(true);

  // Load user when token changes
  useEffect(() => {
    const load = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const res = await fetchUserProfile(token);
        setUser(res.data);
      } catch (err) {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token]);

  // LOGIN
  const login = async (email: string, password: string) => {
    const res = await loginUser(email, password);
    const userToken = res.data.token;

    localStorage.setItem("token", userToken);
    setToken(userToken);

    toast.success("Logged in!");
  };

  // LOGOUT ✅ FIXED
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);

    toast.success("Logged out");

    // ✅ REQUIRED: force navigation
    window.location.href = "/login";
  };

  // UPDATE PROFILE
  const updateUser = async (data: Partial<User>) => {
    if (!token) throw new Error("No auth token");

    const res = await updateUserProfile(token, data);
    setUser(res.data);

    return res.data as User;
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
