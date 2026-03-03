import { useState } from "react";
import { useTasks } from "../context/TaskProvider";

export default function TaskInput({ selectedDate }) {
  const { addTask } = useTasks();
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");

  const handleAdd = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    if (!selectedDate) return;

    addTask( trimmedTitle, selectedDate, time || null);

    setTitle("");
    setTime("");
  };

  return (
    <div className="bg-[#A9B9D6] rounded-2xl px-4 py-3 flex items-center gap-4 mb-8">
      <input
        type="text"
        placeholder="Add a task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1 bg-transparent outline-none text-base"
      />

      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="bg-transparent outline-none"
      />

      <button
        onClick={handleAdd}
        className="bg-blue-600 text-white px-4 py-1.5 rounded-xl text-base"
      >
        Add
      </button>
    </div>
  );
}