import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="px-6 py-4 relative">
      <div className="bg-[#A9B9D6] rounded-2xl px-5 py-3 flex justify-between items-center">
        <h1 className="text-xl font-semibold">
          Chrona
        </h1>

        <div className="flex items-center gap-4 relative">
          {/* Calendar Icon */}
          <div
            onClick={() => navigate("/calendar")}
            className="w-10 h-10 bg-blue-600 rounded-lg cursor-pointer"
          />

          {/* User Icon */}
          <div
            onClick={() => setOpen(!open)}
            className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white cursor-pointer"
          >
            User
          </div>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 top-16 bg-[#B8C8DD] border-4 border-gray-400 rounded-2xl w-56 shadow-lg">
              <div className="p-4 text-lg border-b border-gray-500 text-center">
                User Name
              </div>

              <button className="w-full bg-red-500 text-white text-lg py-3 rounded-b-2xl">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
