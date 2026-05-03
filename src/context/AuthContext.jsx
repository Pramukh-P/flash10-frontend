// flash10-frontend/src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("flash10_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("flash10_user");
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("flash10_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("flash10_user");
  };

  const updatePreferences = (preferences) => {
    const updated = { ...user, preferences };
    setUser(updated);
    localStorage.setItem("flash10_user", JSON.stringify(updated));
  };

  // ✅ NEW: generic patch for any user field (e.g. bookmarks)
  const updateUser = (patch) => {
    const updated = { ...user, ...patch };
    setUser(updated);
    localStorage.setItem("flash10_user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updatePreferences, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}