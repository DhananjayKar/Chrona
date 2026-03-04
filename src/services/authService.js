const STORAGE_KEY = "chrona-users";
const SESSION_KEY = "chrona-session";

export const authService = {
  register(userData) {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    const existingUser = users.find(
      (u) => u.email === userData.email
    );

    if (existingUser) {
      throw new Error("User already exists");
    }

    users.push(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));

    // 🔥 CREATE SESSION
    localStorage.setItem(SESSION_KEY, JSON.stringify(userData));

    return userData;
  },

  login(email, password) {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      throw new Error("Invalid credentials");
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify(user));

    return user;
  },

  logout() {
    localStorage.removeItem(SESSION_KEY);
  },

  getCurrentUser() {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  },
};