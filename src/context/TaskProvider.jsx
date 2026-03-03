import { createContext, useContext, useReducer, useEffect } from "react";
import { taskReducer, initialState } from "../store/taskReducer";
import { taskService } from "../services/taskService";

const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [tasks, dispatch] = useReducer(taskReducer, initialState);

  // Load once
  useEffect(() => {
    const stored = taskService.getAll();
    dispatch({ type: "SET", payload: stored });
  }, []);

  // Save on change
  useEffect(() => {
    taskService.save(tasks);
  }, [tasks]);

  // Clean action wrappers
  const addTask = (title, date, time = null) => {
    dispatch({
      type: "ADD",
      payload: { title, date, time },
    });
  };

  const toggleTask = (id) =>
    dispatch({ type: "TOGGLE", payload: id });

  const editTask = (id, updates) =>
    dispatch({
      type: "EDIT",
      payload: { id, ...updates },
    });

  const deleteTask = (id) =>
    dispatch({ type: "DELETE", payload: id });

  const reorderTasks = (newOrderedTasks) =>
    dispatch({
      type: "REORDER",
      payload: newOrderedTasks,
    });

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        toggleTask,
        editTask,
        deleteTask,
        reorderTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export const useTasks = () => useContext(TaskContext);