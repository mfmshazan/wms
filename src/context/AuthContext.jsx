import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authApi, tokenStore } from "../lib/api";

const AuthContext = createContext(null);

/**
 * Holds the authenticated user and exposes login/register/logout.
 * On mount, if a token is stored, it's validated against /api/auth/me so a
 * page refresh keeps the user signed in.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    tokenStore.clear();
    setUser(null);
  }, []);

  // Validate an existing token once on startup.
  useEffect(() => {
    let active = true;
    const token = tokenStore.get();
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then((res) => active && setUser(res.user))
      .catch(() => active && tokenStore.clear())
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  // Log out if any request reports the session is invalid/expired.
  useEffect(() => {
    const onUnauthorized = () => setUser(null);
    window.addEventListener("wms:unauthorized", onUnauthorized);
    return () => window.removeEventListener("wms:unauthorized", onUnauthorized);
  }, []);

  async function login(email, password) {
    const { token, user } = await authApi.login(email, password);
    tokenStore.set(token);
    setUser(user);
  }

  async function register(name, email, password) {
    const { token, user } = await authApi.register(name, email, password);
    tokenStore.set(token);
    setUser(user);
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "ADMIN",
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
