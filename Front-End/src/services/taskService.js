const STORAGE_KEY =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_APP_NAME) ||
  "Chrona";

export const taskService = {
  getAll() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  save(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  },
};