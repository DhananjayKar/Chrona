import { useState, useEffect, useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";

export default function TaskItem({ task, onToggle, onDelete, onEdit }) {

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editTime, setEditTime] = useState(task.time || "");

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  const editRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (editRef.current && !editRef.current.contains(e.target)) {
        handleCancel();
      }
    }

    if (isEditing) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing]);

  const handleSave = () => {
    onEdit({
      title: editTitle.trim(),
      time: editTime || null
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditTime(task.time || "");
    setIsEditing(false);
  };

  return (
    <motion.li
      ref={setNodeRef}
      style={style}
      className={`rounded-xl p-4 mb-4
      bg-gradient-to-r from-white to-blue-50
      shadow-md border border-gray-200
      flex flex-col sm:flex-row items-start sm:items-center
      justify-between gap-3 sm:gap-4
      relative ${ isDragging ? "scale-105 shadow-xl z-50" : "" }`}
    >

      {isEditing ? (
        <div
          ref={editRef}
          className="relative flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full"
        >

          <button
            onClick={handleCancel}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-200"
          >
            ✕
          </button>

          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            className="flex-1 w-full px-3 py-2 rounded-lg border"
            autoFocus
          />

          <input
            type="time"
            value={editTime}
            onChange={(e) => setEditTime(e.target.value)}
            className="px-3 py-2 rounded-lg border"
          />

          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm"
          >
            Save
          </button>

        </div>
      ) : (
        <>
          {/* LEFT */}
          <div className="flex items-center gap-3 flex-1 min-w-0">

            {/* DRAG HANDLE */}
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing text-gray-400 touch-none"
            >
              <img src="/icons/drag.png" className="w-5 h-5" />
            </div>

            <p
              onClick={onToggle}
              className={`text-base sm:text-lg font-medium cursor-pointer break-all ${
                task.completed
                  ? "line-through text-gray-400"
                  : "text-gray-800"
              }`}
            >
              {task.title}
            </p>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2 sm:gap-3">

            {task.time && (
              <span className="bg-[#F3D98B] border border-red-400 px-3 py-1 rounded-full text-sm">
                {task.time}
              </span>
            )}

            <button
              onClick={onToggle}
              className={`w-9 h-9 rounded-full text-white ${
                task.completed ? "bg-green-500" : "bg-gray-700"
              }`}
            >
              ✓
            </button>

            <button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-400 px-3 py-1.5 rounded-lg text-sm"
            >
              Edit
            </button>

            <button
              onClick={onDelete}
              className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm"
            >
              Delete
            </button>

          </div>
        </>
      )}
    </motion.li>
  );
}