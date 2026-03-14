import Task from "../models/Task.js";

export const createTask = async (req, res) => {
    try {
        const { title, date, time } = req.body;

        const task = await Task.create({
            title,
            date,
            time: time || null,
            userId: req.user.id
        });

        res.status(201).json(task);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id }).sort({ date: 1 });
        res.json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error"});
    }
};

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
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const deleteTask = async (req,res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if(!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        req.json({message: "Task deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const updateTask = async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if(!task) {
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