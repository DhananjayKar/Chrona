import { useState } from "react";
import { useTasks } from "../context/TaskProvider";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isBefore } from "date-fns";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Calendar() {
  const { tasks } = useTasks();
  const navigate = useNavigate();
  const { user } = useAuth();
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
    toast.success(`Navigated to ${new Date(dateISO).toLocaleDateString(
      "en-IN",
      { day: "numeric", month: "numeric", year: "numeric" }
    )} successfully.`);
  };

  const getStatusColor = (date) => {
    const iso = format(date, "yyyy-MM-dd");
    const tasksForDay = tasks.filter((t) => format(new Date(t.date), "yyyy-MM-dd") === iso);

    if (tasksForDay.length === 0) return null;
    if (tasksForDay.every((t) => t.completed)) return "bg-green-400";

    const currentDay = new Date(iso);
    const today = new Date(todayISO);
    if (isBefore(currentDay, today)) return "bg-red-400";

    return "bg-yellow-300";
  };

  // if (!user) {
  //   return (
  //     <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
  //       <h2 className="text-3xl md:text-4xl font-bold text-gray-800 animate-pulse">
  //         You need to be logged in
  //       </h2>
  //       <p className="mt-3 text-gray-600 max-w-md animate-fade-in">
  //         Access your calendar, track your tasks, and stay organized with Chrona.
  //       </p>
  //       <button
  //         onClick={() => navigate("/auth")}
  //         className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-xl text-lg shadow-md transition-all duration-300 hover:scale-105 hover:bg-blue-700 active:scale-95"
  //       >
  //         Go to Login
  //       </button>
  //     </div>
  //   );
  // }

  return (
    <div className="max-w-full sm:max-w-4xl mx-auto py-10 px-2 sm:px-0">
      <h1 className="text-4xl sm:text-5xl font-[cursive] text-center mb-6">
        Calendar
      </h1>

      <div className={`flex flex-row items-center justify-center sm:gap-40 gap-4 mb-6 transition-opacity duration-300 ${isAnimating ? "opacity-0" : "opacity-100"}`}>
        <button onClick={() => changeMonth(-1)}>
          <img src="/icons/arrow-left.png" alt="arrowLeft" className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>

        <h2 className="text-2xl sm:text-3xl font-semibold">{monthLabel}</h2>

        <button onClick={() => changeMonth(1)}>
          <img src="/icons/arrow-right.png" alt="arrowRight" className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
      </div>

      {/* Week Days */}
      <div className="grid grid-cols-7 text-center text-sm sm:text-base font-semibold mb-2 px-1">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((day) => (
          <div key={day} className="truncate">{day}</div>
        ))}
      </div>

      {/* Days - keep squares and responsive */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 w-full max-w-[400px] sm:max-w-full mx-auto">
        {/* Invisible placeholders for alignment */}
        {Array.from({ length: startWeekDay }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square invisible"></div>
        ))}

        {days.map((date) => {
          const iso = format(date, "yyyy-MM-dd");
          const statusColor = getStatusColor(date);
          const isTodayCell = iso === todayISO;

          return (
            <div
              key={date.toISOString()}
              className={`aspect-square border rounded-xl flex items-center justify-center relative cursor-pointer transition
                ${isTodayCell ? "bg-green-100 border-blue-400 hover:bg-green-200" : ""}
              `}
            >
              <button
                onClick={() => handleDateClick(iso)}
                className="w-full h-full flex items-center justify-center"
              >
                <span className="text-sm sm:text-lg font-bold relative z-10">
                  {format(date, "d")}
                </span>
              </button>

              {statusColor && (
                <div className={`absolute w-1/2 h-1/2 sm:w-10 sm:h-10 rounded-full opacity-60 ${statusColor}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="hidden sm:flex flex-row justify-center gap-10 mt-8">
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
      <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full ${color}`} />
      <span className="text-sm sm:text-lg">{label}</span>
    </div>
  );
}