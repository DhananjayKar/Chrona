import { useState, useEffect, useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function TaskItem({
  task,
  onToggle,
  onDelete,
  onEdit,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editTime, setEditTime] = useState(task.time || "");

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSave = () => {
    onEdit({
      title: editTitle.trim(),
      time: editTime || null,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditTime(task.time);
    setIsEditing(false);
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`rounded-lg p-3 mb-3 bg-gray-50 shadow-sm 
      flex items-center justify-between gap-4 touch-manipulation
      ${isDragging ? "shadow-xl scale-105" : ""}`}
    >
      {isEditing ? (
        <div ref={editRef} className="relative flex items-center gap-4 w-full p-1 rounded-xl">

          {/* Close Button */}
          <button
            onClick={handleCancel}
            className="absolute top-0 right-0 -translate-y-3/4 translate-x-3/4 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-700 transition"
          >
            ✕
          </button>

          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            className="flex-1 px-3 py-1 rounded-lg border outline-none"
            autoFocus
          />

          <input
            type="time"
            value={editTime}
            onChange={(e) => setEditTime(e.target.value)}
            className="px-2 py-1 rounded-lg border"
          />

          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-3 py-1.5 rounded-xl text-sm"
          >
            Save
          </button>
        </div>
      ) : (
        <>
          {/* LEFT */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <p
              onClick={onToggle}
              className={`text-base font-medium cursor-pointer wrap-break-words ${
                task.completed
                  ? "line-through text-gray-500"
                  : ""
              }`}
            >
              {task.title}
            </p>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3 shrink-0">
            {task.time && (
              <span className="bg-[#F3D98B] border border-red-400 px-3 py-0.5 rounded-full text-sm shrink-0">
                {task.time}
              </span>
            )}
            <button
              onClick={onToggle}
              className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm ${
                task.completed
                  ? "bg-green-500"
                  : "bg-gray-700"
              }`}
            >
              ✓
            </button>

            <button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-400 px-3 py-1.5 rounded-xl text-sm whitespace-nowrap"
            >
              Edit
            </button>

            <button
              onClick={onDelete}
              className="bg-red-500 text-white px-3 py-1.5 rounded-xl text-sm whitespace-nowrap"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </li>
  );
}