import { createContext, useContext, useState, useEffect } from "react";
import { taskService } from "../services/taskService";

const STORAGE_KEY =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_APP_NAME) ||
  "Chrona";

const AuthContext = createContext();

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Load user on refresh
  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) setUser(storedUser);
    } catch {
      setUser(null);
    }
    setLoading(false);
  }, []);

  // 🔐 LOGIN
  const login = async (email, password) => {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    console.log("LOGIN RESPONSE:", data);

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    if (!data.token) {
      throw new Error("No token received from server");
    }

    // ✅ STEP 1: store token FIRST
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    // 🔥 STEP 2: IMPORT guest tasks BEFORE setting user
    await handleGuestImport();

    // ✅ STEP 3: NOW update state
    setUser(data.user);

    // 🔥 STEP 4: reload AFTER everything
    window.location.reload();

    return data.user;
  };

  // 📝 REGISTER
  const register = async (formData) => {
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    console.log("REGISTER RESPONSE:", data);

    if (!res.ok) {
      throw new Error(data.message || "Registration failed");
    }

    if (!data.token) {
      throw new Error("No token received from server");
    }

    // ✅ STEP 1: store token FIRST
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    // 🔥 STEP 2: IMPORT guest tasks BEFORE setting user
    await handleGuestImport();

    // ✅ STEP 3: NOW update state
    setUser(data.user);

    // 🔥 STEP 4: reload AFTER everything
    window.location.reload();

    return data.user;
  };

  // 🔥 Guest → User migration
  const handleGuestImport = async () => {

    const raw = localStorage.getItem(STORAGE_KEY);
    const tasks = raw ? JSON.parse(raw) : [];

    const guestTasks = tasks.filter(t => t.userEmail === "Guest");

    console.log("IMPORT FUNCTION CALLED");
    console.log("Guest tasks:", guestTasks);

    if (guestTasks.length > 0) {

      const confirmImport = window.confirm(
        "Import your guest tasks to your account?"
      );

      if (confirmImport) {
        await taskService.importGuestTasks();
      }

    }

  };

  // 🚪 LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);

    // 🔥 hard reset
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// 🔗 Hook
export const useAuth = () => useContext(AuthContext);