import express from "express";
import { createTask, getTasks, toggleTask,deleteTask, updateTask } from "../controllers/taskController.js";
import protectTask from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protectTask, createTask);
router.get("/",protectTask, getTasks);
router.patch("/:id/toggle", protectTask, toggleTask);
router.delete("/:id", protectTask, deleteTask);
router.put("/:id", protectTask, updateTask);

export default router;