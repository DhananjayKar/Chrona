import { useState } from "react";
import { useTasks } from "../context/TaskProvider";
import toast from "react-hot-toast";

export default function TaskInput({ selectedDate }) {
  const { addTask } = useTasks();
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");

  const handleAdd = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      toast.error("Tasks cannot be empty.");
      return;
    }
    if (!selectedDate) return;

    addTask(trimmedTitle, selectedDate, time || null);
    setTitle("");
    setTime("");
  };

  return (
    <div className="bg-[#A9B9D6] rounded-2xl px-3 sm:px-4 py-3 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-8 border-2 border-double border-blue-900">
      
      <input
        type="text"
        placeholder="Add a task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e)=>{
          if (e.key === "Enter") {
            handleAdd();
          }
        }}
        className="w-full sm:flex-1 bg-transparent outline-none text-base px-2 py-1 rounded-md"
      />

      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="w-full sm:w-auto bg-transparent outline-none text-base px-2 py-1 rounded-md"
      />

      <button
        onClick={handleAdd}
        className="w-full sm:w-auto bg-blue-600 text-white px-4 py-1.5 rounded-xl text-base hover:bg-blue-700 transition-colors"
      >
        Add
      </button>
    </div>
  );
}