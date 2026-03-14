import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import connectDB from "./config/database.js";

dotenv.config();
connectDB();

const app = express();

app.use (cors());
app.use (express.json());
app.use ("/auth", authRoutes);
app.use("/tasks", taskRoutes);

app.get ("/", (req, res) => {
    res.send ("Chrona API Running!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});