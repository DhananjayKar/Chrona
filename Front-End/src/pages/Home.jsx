import { useTasks } from "../context/TaskProvider";
import { getTodayISO, isToday } from "../utils/date";
import { useSearchParams } from "react-router-dom";
import TaskInput from "../components/TaskInput";
import TaskItem from "../components/TaskItem";

import { restrictToParentElement, restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { useState } from "react";
import { motion } from "framer-motion";
import GuestWarning from "../components/GuestWarning";

export default function Home() {
  const { tasks, toggleTask, editTask, deleteTask, reorderTasks } = useTasks();

  const safeTasks = Array.isArray(tasks) ? tasks : [];

  const [hovered, setHovered] = useState(false);

  const [searchParams] = useSearchParams();
  const queryDate = searchParams.get("date");

  const selectedDate = queryDate
    ? new Date(queryDate).toISOString().split("T")[0]
    : getTodayISO();

  const formattedDate = new Date(selectedDate).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const filteredTasks = safeTasks.filter((t) => t?.date === selectedDate);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = filteredTasks.findIndex((t) => t.id === active.id);
    const newIndex = filteredTasks.findIndex((t) => t.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reorderedFiltered = arrayMove(filteredTasks, oldIndex, newIndex).map((task, index) => ({
      ...task,
      order: index
    }));

    const otherTasks = safeTasks.filter((t) => t?.date !== selectedDate);

    reorderTasks([...otherTasks, ...reorderedFiltered]);
  };

  return (
    <div className="flex-1 pb-24">
      <GuestWarning />
      <div className="max-w-full sm:max-w-xl mx-auto px-4 sm:px-6 pt-6 pb-1">

        {/* Date Section */}
        <motion.div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 260, damping: 15 }}
          className="w-52 h-14 inline-flex items-center gap-3 pt-4 rounded-xl font-bold text-sm sm:text-base cursor-pointer"
        >
          <span className="text-blue-700">
            {isToday(selectedDate) && hovered ? "Today" : formattedDate}
          </span>
        </motion.div>

        {/* Divider */}
        <div className="h-[3px] w-48 sm:w-56 bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 rounded-full mb-4"></div>

        {/* Task Input */}
        <div className="p-4 pb-0 mt-2">
          <TaskInput selectedDate={selectedDate} />
        </div>

        {/* Task List */}
        <div className="pb-2.5">
          {filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-10 px-2"
            >
              <p className="text-base sm:text-lg font-serif text-gray-700">
                No tasks. Please add if required.
              </p>
            </motion.div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToParentElement, restrictToVerticalAxis]}
            >
              <SortableContext
                items={filteredTasks.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                <ul className="mt-6 sm:mt-8 px-1 sm:px-0">
                  {filteredTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={() => toggleTask(task.id)}
                      onDelete={() => deleteTask(task.id)}
                      onEdit={(updates) => editTask(task.id, updates)}
                    />
                  ))}
                </ul>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>
    </div>
  );
}