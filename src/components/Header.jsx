import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isCalendar = location.pathname === "/calendar";
  const isAuthPage = location.pathname === "/auth";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    const handleScroll = () => {
      setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header className="relative">
      <div className="bg-[#A9B9D6] rounded-b-2xl px-5 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4 relative">
        <img src="/icons/chrona.png" alt="Chrona Icon" className="w-8 h-8" onClick={() => navigate("/")} />
        <h1
          onClick={() => navigate("/")}
          className="text-xl font-semibold cursor-pointer"
        >
          Chrona
        </h1>
        </div>

        <div className="flex items-center gap-4 relative">
          {/* Dynamic Icon */}
          {!user || !isAuthPage && ( <>
            <div
            onClick={() =>{
              navigate(isCalendar ? "/" : "/calendar");
              toast.success(`Switched to ${isCalendar? "Home": "Calendar"}`);}
            }
            className="w-12 h-12 cursor-pointer flex items-center justify-center"
          >
            {isCalendar ? <img src="/icons/home.gif" alt="Home" /> : <img src="/icons/calendar.gif" alt="Calendar" />}
          </div>
          <div ref={dropdownRef} className="relative">
          {/* User Icon */}
          <div
            onClick={() => setOpen(!open)}
            className="w-10 h-10 flex items-center justify-center cursor-pointer"
          >
            <img src="/icons/user.png" alt="User Icon" />
          </div>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 top-16 bg-[#B8C8DD] border-4 border-gray-400 rounded-2xl w-56 shadow-lg z-50">
              
              <div className="p-4 text-lg border-b border-gray-500 text-center">
                {user?.name || "User"}
              </div>

              <button
                onClick={() => {
                  logout();
                  navigate("/auth");
                }}
                className="w-full bg-red-500 text-white text-lg py-3 rounded-b-2xl"
              >
                Logout
              </button>
            </div>
          )}
          </div> </>
        )}
        </div>
      </div>
    </header>
  );
}