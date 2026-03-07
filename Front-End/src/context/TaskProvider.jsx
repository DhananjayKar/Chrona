import { createContext, useContext, useReducer, useEffect, useRef } from "react";
import { taskReducer, initialState } from "../store/taskReducer";
import { taskService } from "../services/taskService";
import toast from "react-hot-toast";

const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [tasks, dispatch] = useReducer(taskReducer, initialState);

  const isFirstRender = useRef(true);

  // Load once
  useEffect(() => {
    const stored = taskService.getAll();
    dispatch({ type: "SET", payload: stored });
  }, []);

  // Save on change (but NOT on first render)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    taskService.save(tasks);
  }, [tasks]);

  const addTask = (title, date, time = null) => {
    dispatch({
      type: "ADD",
      payload: { title, date, time },
    });
    toast.success(`Successfully added ${title}!`);
  };

  const toggleTask = (id) => {
    dispatch({ type: "TOGGLE", payload: id });
    toast.success("Task checked.")
  }

  const editTask = (id, updates) => {
    dispatch({
      type: "EDIT",
      payload: { id, ...updates },
    });
    toast.success("Task updated successfully!");
  }

  const deleteTask = (id) => {
    dispatch({ type: "DELETE", payload: id });
    toast.success("Task deleted successfully.")
  }

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