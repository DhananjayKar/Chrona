import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const existing = authService.getCurrentUser();
    if (existing) setUser(existing);
  }, []);

  const login = (email, password) => {
    const user = authService.login(email, password);
    setUser(user);
    return user;
  };

  const register = (data) => {
    const user = authService.register(data);
    setUser(user);
    return user;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);