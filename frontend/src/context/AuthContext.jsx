import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const storedUser = localStorage.getItem("notesharbor_user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("notesharbor_token") || "");
  const [user, setUser] = useState(() => readStoredUser());

  useEffect(() => {
    const syncAuthState = () => {
      setToken(localStorage.getItem("notesharbor_token") || "");
      setUser(readStoredUser());
    };

    window.addEventListener("storage", syncAuthState);
    window.addEventListener("authchange", syncAuthState);

    return () => {
      window.removeEventListener("storage", syncAuthState);
      window.removeEventListener("authchange", syncAuthState);
    };
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      login: ({ token: newToken, user: newUser }) => {
        localStorage.setItem("notesharbor_token", newToken);
        localStorage.setItem("notesharbor_user", JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
        window.dispatchEvent(new Event("authchange"));
      },
      logout: () => {
        localStorage.removeItem("notesharbor_token");
        localStorage.removeItem("notesharbor_user");
        setToken("");
        setUser(null);
        window.dispatchEvent(new Event("authchange"));
      },
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}