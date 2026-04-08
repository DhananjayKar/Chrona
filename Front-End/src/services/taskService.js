const STORAGE_KEY =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_APP_NAME) ||
  "Chrona";

const API =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_URL) ||
  "http://localhost:5000";

function getToken() {
  return localStorage.getItem("token");
}

export const taskService = {

  // =========================
  // LOAD GUEST TASKS
  // =========================
  async getAll() {

    const raw = localStorage.getItem(STORAGE_KEY);
    const tasks = raw ? JSON.parse(raw) : [];

    console.log("Guest tasks:", tasks);

    return Array.isArray(tasks) ? tasks.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)) : [];
  },


  // =========================
  // LOAD USER TASKS (MongoDB)
  // =========================
  async getTasks() {

    const token = getToken();
    if (!token) return [];

    const res = await fetch(`${API}/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    console.log("Mongo tasks:", data);

    if (!Array.isArray(data)) return [];

    return data.map((task) => ({
      id: task._id,
      title: task.title,
      date: task.date,
      time: task.time,
      completed: task.completed || false,
      order: task.order ?? 0
    })).sort((a, b) => a.order - b.order);
  },


  // =========================
  // SAVE GUEST TASKS
  // =========================
  save(tasks) {

    const token = getToken();

    // Only save for guest
    if (token) return;

    console.log("Saving guest tasks:", tasks);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  },


  // =========================
  // CREATE TASK
  // =========================
  async createTask(task) {

    const token = getToken();

    // Guest Mode
    if (!token) {
      return {
        id: crypto.randomUUID(),
        title: task.title,
        date: task.date,
        time: task.time || null,
        completed: false,
        userEmail: "Guest",
        order: Date.now(),
      };
    }

    // Logged In Mode
    const res = await fetch(`${API}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(task),
    });

    const data = await res.json();

    return {
      id: data._id,
      title: data.title,
      date: data.date,
      time: data.time,
      completed: data.completed,
    };
  },


  // =========================
  // TOGGLE TASK
  // =========================
  async toggleTask(id) {

    const token = getToken();

    if (!token) {
      return id;
    }

    const res = await fetch(`${API}/tasks/${id}/toggle`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    return {
      id: data._id,
      title: data.title,
      date: data.date,
      time: data.time,
      completed: data.completed,
    };
  },


  // =========================
  // DELETE TASK
  // =========================
  async deleteTask(id) {

    const token = getToken();

    if (!token) {
      return id;
    }

    await fetch(`${API}/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return id;
  },


  // =========================
  // UPDATE TASK
  // =========================
  async updateTask(id, updates) {

    const token = getToken();

    // Guest Mode
    if (!token) {
      return {
        id,
        ...updates,
      };
    }

    const res = await fetch(`${API}/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    const data = await res.json();

    return {
      id: data._id,
      title: data.title,
      date: data.date,
      time: data.time,
      completed: data.completed,
    };
  },


  // =========================
  // IMPORT GUEST TASKS → USER
  // =========================
  async importGuestTasks() {

    const token = getToken();
    if (!token) return;

    const raw = localStorage.getItem(STORAGE_KEY);
    const tasks = raw ? JSON.parse(raw) : [];

    const guestTasks = tasks.filter(
      (t) => !t.userEmail || t.userEmail === "Guest"
    );

    console.log("Importing guest tasks:", guestTasks);

    for (const task of guestTasks) {

      const res = await fetch(`${API}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: task.title,
          date: task.date,
          time: task.time,
          completed: task.completed,
        }),
      });

      if (!res.ok) {
        console.error("Failed importing task");
      }
    }

    // Remove imported guest tasks
    const remaining = tasks.filter(
      (t) => t.userEmail !== "Guest"
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
  },

};