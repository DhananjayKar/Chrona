import { createContext, useContext, useReducer, useEffect, useRef } from "react";
import { taskReducer, initialState } from "../store/taskReducer";
import { taskService } from "../services/taskService";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const TaskContext = createContext();

export function TaskProvider({ children }) {

  const [tasks, dispatch] = useReducer(taskReducer, initialState);

  const { user } = useAuth();

  const isLoggedIn = !!user;

  // 🔒 prevents save before tasks load
  const isLoaded = useRef(false);

  // =========================
  // LOAD TASKS
  // =========================
  useEffect(() => {

    const loadTasks = async () => {

      try {

        let data = [];

        if (isLoggedIn) {
          data = await taskService.getTasks();
        } else {
          data = await taskService.getAll();
        }

        dispatch({
          type: "SET",
          payload: Array.isArray(data) ? data : [],
        });

        // allow saving AFTER load
        isLoaded.current = true;

      } catch (err) {
        console.error(err);
        toast.error("Failed to load tasks");
      }

    };

    loadTasks();

  }, [isLoggedIn]);



  // =========================
  // SAVE GUEST TASKS
  // =========================
  useEffect(() => {

    // ❌ don't save before tasks load
    if (!isLoaded.current) return;

    // ❌ don't save if logged in
    if (isLoggedIn) return;

    taskService.save(tasks);

  }, [tasks, isLoggedIn]);



  // =========================
  // ADD TASK
  // =========================
  const addTask = async (title, date, time = null) => {

    try {

      if (isLoggedIn) {

        await taskService.createTask({ title, date, time });

        const updatedTasks = await taskService.getTasks();

        dispatch({
          type: "SET",
          payload: updatedTasks,
        });

      } else {

        dispatch({
          type: "ADD",
          payload: { title, date, time },
        });

      }

      toast.success(`Added "${title}"`);

    } catch (err) {

      console.error(err);
      toast.error("Failed to add task");

    }

  };



  // =========================
  // TOGGLE TASK
  // =========================
  const toggleTask = async (id) => {

    try {

      if (isLoggedIn) {

        await taskService.toggleTask(id);

        const updatedTasks = await taskService.getTasks();

        dispatch({
          type: "SET",
          payload: updatedTasks,
        });

      } else {

        dispatch({
          type: "TOGGLE",
          payload: id,
        });

      }

    } catch (err) {

      console.error(err);
      toast.error("Failed to toggle task");

    }

  };



  // =========================
  // EDIT TASK
  // =========================
  const editTask = async (id, updates) => {

    try {

      if (isLoggedIn) {

        await taskService.updateTask(id, updates);

        const updatedTasks = await taskService.getTasks();

        dispatch({
          type: "SET",
          payload: updatedTasks,
        });

      } else {

        dispatch({
          type: "EDIT",
          payload: { id, ...updates },
        });

      }

      toast.success("Task updated");

    } catch (err) {

      console.error(err);
      toast.error("Update failed");

    }

  };



  // =========================
  // DELETE TASK
  // =========================
  const deleteTask = async (id) => {

    try {

      if (isLoggedIn) {

        await taskService.deleteTask(id);

        const updatedTasks = await taskService.getTasks();

        dispatch({
          type: "SET",
          payload: updatedTasks,
        });

      } else {

        dispatch({
          type: "DELETE",
          payload: id,
        });

      }

      toast.success("Task deleted");

    } catch (err) {

      console.error(err);
      toast.error("Failed to delete");

    }

  };



  // =========================
  // DRAG REORDER
  // =========================
  const reorderTasks = (newTasks) => {

    dispatch({
      type: "REORDER",
      payload: newTasks,
    });

  };



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