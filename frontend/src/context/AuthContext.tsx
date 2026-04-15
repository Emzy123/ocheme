import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const TOKEN_KEY = "emmanuel_admin_token";

type AuthContextValue = {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem(TOKEN_KEY));

  useEffect(() => {
    if (token) sessionStorage.setItem(TOKEN_KEY, token);
    else sessionStorage.removeItem(TOKEN_KEY);
  }, [token]);

  const login = useCallback((t: string) => setToken(t), []);
  const logout = useCallback(() => setToken(null), []);

  useEffect(() => {
    const handler = () => setToken(null);
    window.addEventListener("admin:unauthorized", handler);
    return () => window.removeEventListener("admin:unauthorized", handler);
  }, []);

  const value = useMemo(() => ({ token, login, logout }), [token, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
