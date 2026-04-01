const TASK_KEY = "Chrona";

export const getTasks = (userEmail = "guest") => {
  const tasks = JSON.parse(localStorage.getItem(TASK_KEY)) || [];

  return tasks.filter(task => task.userEmail === userEmail);
};

export const saveTask = (task) => {
  const tasks = JSON.parse(localStorage.getItem(TASK_KEY)) || [];

  tasks.push(task);

  localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
};

export const updateTask = (updatedTask) => {
  let tasks = JSON.parse(localStorage.getItem(TASK_KEY)) || [];

  tasks = tasks.map(task =>
    task.id === updatedTask.id ? updatedTask : task
  );

  localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
};

export const deleteTask = (taskId) => {
  let tasks = JSON.parse(localStorage.getItem(TASK_KEY)) || [];

  tasks = tasks.filter(task => task.id !== taskId);

  localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
};