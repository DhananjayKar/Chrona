import { useState } from "react";
import { useTasks } from "../context/TaskProvider";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Calendar() {
  const { tasks } = useTasks();
  console.log("TASKS:", tasks);
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const firstDay = startOfMonth(currentDate);
  const lastDay = endOfMonth(currentDate);
  const days = eachDayOfInterval({
    start: firstDay,
    end: lastDay,
  });
  const [isAnimating, setIsAnimating] = useState(false);

  const monthLabel = format(currentDate, "MMMM yyyy");
  const startWeekDay = getDay(firstDay);
  const todayISO = format(new Date(), "yyyy-MM-dd");

    const changeMonth = (direction) => {
    setIsAnimating(true);

    setTimeout(() => {
        const newDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + direction,
        1
        );
        setCurrentDate(newDate);
        setIsAnimating(false);
    }, 150);
    };

    const handleDateClick = (dateISO) => {
      navigate(`/?date=${dateISO}`);
    };

  const getStatusColor = (date) => {
    const iso = format(date, "yyyy-MM-dd");

    const tasksForDay = tasks.filter((t) => {
    const taskDate = format(new Date(t.date), "yyyy-MM-dd");
    return taskDate === iso;
    });

    if (tasksForDay.length === 0) return null;

    const allCompleted = tasksForDay.every(
      (t) => t.completed
    );

    const someIncomplete = tasksForDay.some(
      (t) => !t.completed
    );

    if (allCompleted) return "bg-green-400";
    if (someIncomplete) return "bg-red-400";

    return "bg-yellow-300";
  };

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-5xl font-[cursive] text-center mb-6">
        Calendar
      </h1>

      <div
        className={`flex items-center justify-center gap-40 mb-6 transition-opacity duration-300 ${
            isAnimating ? "opacity-0" : "opacity-100"
        }`}
        >
        <button onClick={() => changeMonth(-1)}>
          <ChevronLeft size={40} />
        </button>

        <h2 className="text-3xl font-semibold">
          {monthLabel}
        </h2>

        <button onClick={() => changeMonth(1)}>
          <ChevronRight size={40} />
        </button>
      </div>

      <div className="grid grid-cols-7 text-center font-semibold mb-2">
        {["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {Array.from({ length: startWeekDay }).map((_, i) => (
          <div key={`empty-${i}`} className="h-20 border"></div>
        ))}

        {days.map((date) => {
            const iso = format(date, "yyyy-MM-dd");
            const statusColor = getStatusColor(date);
            const isTodayCell = iso === todayISO;

          return (
            <div
            key={date.toISOString()}
            className={`h-20 border flex items-center justify-center relative cursor-pointer transition
                ${isTodayCell ? "bg-blue-50 border-blue-400" : ""}
            `}
            >
              <button onClick={() => handleDateClick(date)}><span className="text-lg font-bold relative z-10">
                {format(date, "d")}
              </span></button>

              {statusColor && (
                <div
                  className={`absolute w-10 h-10 rounded-full opacity-60 ${statusColor}`}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-center gap-10 mt-8">
        <Legend color="bg-yellow-300" label="Pending" />
        <Legend color="bg-red-400" label="Incomplete" />
        <Legend color="bg-green-400" label="Completed" />
      </div>
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-6 h-6 rounded-full ${color}`} />
      <span className="text-lg">{label}</span>
    </div>
  );
}
