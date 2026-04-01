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

export default function Home() {
  const { tasks, toggleTask, editTask, deleteTask, reorderTasks } = useTasks();

  // 🛡️ SAFETY: ensure tasks is always an array
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

  // 🛡️ SAFE FILTER
  const filteredTasks = safeTasks.filter(
    (t) => t?.date === selectedDate
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = filteredTasks.findIndex((t) => t.id === active.id);
    const newIndex = filteredTasks.findIndex((t) => t.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return; // 🛡️ safety

    const reorderedFiltered = arrayMove(filteredTasks, oldIndex, newIndex);

    // 🛡️ SAFE OTHER TASKS
    const otherTasks = safeTasks.filter(
      (t) => t?.date !== selectedDate
    );

    reorderTasks([...otherTasks, ...reorderedFiltered]);
  };

  return (
    <div className="flex-1">
      <div className="max-w-full sm:max-w-xl mx-auto px-4 sm:px-6 pt-6 pb-1">
        
        {/* Date & TODAY Badge */}
        <p className="inline-flex items-center gap-2 sm:gap-3 text-blue-700 px-3 sm:px-4 py-2 rounded-xl font-bold mb-1 text-sm sm:text-base">
          {formattedDate}
          {isToday(selectedDate) && (
            <span className="bg-green-500 text-white text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1 rounded-full shadow-sm">
              TODAY
            </span>
          )}
        </p>

        {/* Divider */}
        <div className="text-red-400 border-2 rounded-full shadow-2xl w-50 sm:w-72"></div>

        {/* Task Input */}
        <div className="p-4 pb-0 mt-4">
          <TaskInput selectedDate={selectedDate} />
        </div>

        {/* Task List */}
        <div className="pb-2.5">
          {filteredTasks.length === 0 ? (
            <div className="text-center mt-10 px-2">
              <p className="text-base sm:text-lg font-serif text-gray-700">
                No tasks. Please add if required.
              </p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToParentElement]}
            >
              <SortableContext
                items={filteredTasks
                  .map((t) => t?.id)
                  .filter(Boolean)} // 🛡️ avoid undefined ids
                strategy={verticalListSortingStrategy}
              >
                <ul className="mt-6 sm:mt-8 px-1 sm:px-0">
                  {filteredTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={() => toggleTask(task.id)}
                      onDelete={() => deleteTask(task.id)}
                      onEdit={(updates) =>
                        editTask(task.id, updates)
                      }
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