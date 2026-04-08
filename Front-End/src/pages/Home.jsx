import { useTasks } from "../context/TaskProvider";
import { getTodayISO, isToday } from "../utils/date";
import { useSearchParams } from "react-router-dom";
import TaskInput from "../components/TaskInput";
import TaskItem from "../components/TaskItem";
import { restrictToParentElement } from "@dnd-kit/modifiers";
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
import { useState  } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const { tasks, toggleTask, editTask, deleteTask, reorderTasks } = useTasks();
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);

  const safeTasks = Array.isArray(tasks) ? tasks : [];

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
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = filteredTasks.findIndex((t) => t.id === active.id);
    const newIndex = filteredTasks.findIndex((t) => t.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reorderedFiltered = arrayMove(filteredTasks, oldIndex, newIndex);

    const otherTasks = safeTasks.filter((t) => t?.date !== selectedDate);

    reorderTasks([...otherTasks, ...reorderedFiltered]);
  };

  return (
    <div className="flex-1">
      <div className="max-w-full sm:max-w-xl mx-auto px-4 sm:px-6 pt-6 pb-1">

        {/* Animated Date Section */}
        <motion.div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={()=> { setActive(!active) }}
          whileHover={{ scale: 1.25 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 260, damping: 15 }}
          className="w-52 h-14
            inline-flex items-center gap-3 pt-4 rounded-xl
            font-bold text-sm sm:text-base
            cursor-pointer
            transition-all duration-150
          "
        >
          <span className="text-blue-700 transition-all duration-200">
            {isToday(selectedDate) && hovered ? "Today" : formattedDate}
          </span>

        </motion.div>

        {/* Modern Divider */}
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
              modifiers={[restrictToParentElement]}
            >
              <SortableContext
                items={filteredTasks.map((t) => t?.id).filter(Boolean)}
                strategy={verticalListSortingStrategy}
              >
                <motion.ul
                  layout
                  className="mt-6 sm:mt-8 px-1 sm:px-0"
                >
                  {filteredTasks.map((task, index) => (
                    <motion.div
                      key={task.id || index}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <TaskItem
                        task={task}
                        onToggle={() => toggleTask(task.id)}
                        onDelete={() => deleteTask(task.id)}
                        onEdit={(updates) => editTask(task.id, updates)}
                      />
                    </motion.div>
                  ))}
                </motion.ul>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>
    </div>
  );
}