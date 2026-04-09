import Task from "../models/Task.js";


// ==============================
// CREATE TASK
// ==============================
export const createTask = async (req, res) => {
  try {
    const { title, date, time, completed } = req.body;

    const firstTask = await Task.findOne({
        userId: req.user.id,
        date
    }).sort({ order: 1 });

    const newOrder = firstTask ? firstTask.order - 1 : 0;

    const task = await Task.create({
      title,
      date,
      time: time || null,
      completed: completed ?? false,
      order: newOrder,
      userId: req.user.id
    });

    res.status(201).json(task);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// ==============================
// GET ALL TASKS
// ==============================
export const getTasks = async (req, res) => {
  try {

    const tasks = await Task
      .find({ userId: req.user.id })
      .sort({ date: 1, order: 1 }); // important for drag order

    res.json(tasks);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// ==============================
// TOGGLE TASK
// ==============================
export const toggleTask = async (req, res) => {
  try {

    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.completed = !task.completed;

    await task.save();

    res.json(task);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// ==============================
// DELETE TASK
// ==============================
export const deleteTask = async (req, res) => {
  try {

    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// ==============================
// UPDATE TASK
// ==============================
export const updateTask = async (req, res) => {
  try {

    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.title = req.body.title ?? task.title;
    task.date = req.body.date ?? task.date;
    task.time = req.body.time ?? task.time;
    task.completed = req.body.completed ?? task.completed;

    await task.save();

    res.json(task);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// ==============================
// REORDER TASKS (DRAG & DROP)
// ==============================
export const reorderTasks = async (req, res) => {
  try {

    const { tasks } = req.body;

    if (!Array.isArray(tasks)) {
      return res.status(400).json({ message: "Invalid tasks payload" });
    }

    const updates = tasks.map(task =>
      Task.findOneAndUpdate(
        { _id: task.id, userId: req.user.id },
        { order: task.order }
      )
    );

    await Promise.all(updates);

    res.json({ message: "Order updated" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};