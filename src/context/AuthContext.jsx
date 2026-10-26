import { createContext, useContext, useState } from 'react';

/**
 * UI-ONLY auth. There is no backend: logging in just stores a role in sessionStorage
 * so the alumni/admin areas can be previewed. Replace login() with a real API call.
 */
const AuthContext = createContext(null);
const KEY = 'portal-ui-user';

const read = () => {
  try { return JSON.parse(sessionStorage.getItem(KEY)); } catch { return null; }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(read);
  const login = (u) => {
    setUser(u);
    try { sessionStorage.setItem(KEY, JSON.stringify(u)); } catch { /* storage unavailable */ }
  };
  const logout = () => {
    setUser(null);
    try { sessionStorage.removeItem(KEY); } catch { /* storage unavailable */ }
  };
  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
