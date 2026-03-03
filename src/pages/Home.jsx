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
  const {
    tasks,
    toggleTask,
    editTask,
    deleteTask,
    reorderTasks,
  } = useTasks();

  const [searchParams] = useSearchParams();

  const selectedDate =
    searchParams.get("date") || getTodayISO();

  const formattedDate = new Date(selectedDate).toLocaleDateString(
    "en-IN",
    {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );

  const filteredTasks = tasks.filter(
    (t) => t.date === selectedDate
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = filteredTasks.findIndex(
      (t) => t.id === active.id
    );

    const newIndex = filteredTasks.findIndex(
      (t) => t.id === over.id
    );

    const reorderedFiltered = arrayMove(
      filteredTasks,
      oldIndex,
      newIndex
    );

    const otherTasks = tasks.filter(
      (t) => t.date !== selectedDate
    );

    reorderTasks([...otherTasks, ...reorderedFiltered]);
  };

  return (
    <div className="flex-1">
      <div className="max-w-xl mx-auto px-6 py-6">
        <p className="inline-flex items-center gap-3 bg-[#F6B5B5] text-blue-700 px-4 py-2 rounded-xl font-medium mb-6">
          {formattedDate}

          {isToday(selectedDate) && (
            <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
              TODAY
            </span>
          )}
        </p>

        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <TaskInput selectedDate={selectedDate} />
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          {filteredTasks.length === 0 ? (
            <div className="text-center mt-10">
              <p className="text-lg font-serif text-gray-700">
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
                items={filteredTasks.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                <ul className="mt-8">
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