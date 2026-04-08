import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const isCalendar = location.pathname === "/calendar";
  const isAuthPage = location.pathname === "/auth";
  const currentDate = searchParams.get("date");

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
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
      <div className="bg-[#A9B9D6] rounded-b-2xl px-2 sm:px-3 py-2 sm:py-3 flex flex-wrap sm:flex-nowrap justify-between items-center">
        {/* Logo & Title */}
        <div className="flex items-center gap-2 sm:gap-4 cursor-pointer" onClick={() => navigate("/")}>
          <img src="/icons/chrona.png" alt="Chrona Icon" className="w-6 h-6 sm:w-8 sm:h-8" />
          <h1 className="text-lg sm:text-xl font-semibold">Chrona</h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-4 mt-2 sm:mt-0">
          {/* Dynamic Icon */}
          {!isAuthPage ? (
            <>
              <div
                onClick={() => {
                  if (isCalendar) {
                    navigate(currentDate ? `/?date=${currentDate}` : "/");
                  } else {
                    navigate("/calendar");
                  }
                  toast.success(`Switched to ${isCalendar ? "Home" : "Calendar"}`);
                }}
                className="w-10 h-10 sm:w-12 sm:h-12 cursor-pointer flex items-center justify-center"
              >
                {isCalendar ? (
                  <img src="/icons/home.gif" alt="Home" />
                ) : (
                  <img src="/icons/calendar.gif" alt="Calendar" />
                )}
              </div>

              {/* User Icon */}
                {user ? (
                  <div ref={dropdownRef} className="relative">
                    <div
                      onClick={() => setOpen(!open)}
                      className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center cursor-pointer"
                    >
                      <img src="/icons/user.png" alt="User Icon" />
                    </div>

                    {/* Dropdown */}
                    {open && (
                      <div className="absolute right-0 top-12 sm:top-16 bg-[#B8C8DD] border-4 border-gray-400 rounded-2xl w-44 sm:w-56 shadow-lg z-50">
                        <div className="p-3 sm:p-4 text-base sm:text-lg border-double border-gray-500 text-center">
                          <p className="hover:scale-110">{user?.name || "User"}</p>
                        </div>

                        <button
                          onClick={() => {
                            logout();
                            navigate("/auth");
                          }}
                          className="w-full bg-red-400 hover:bg-red-500 hover:text-white text-base sm:text-lg py-2 sm:py-3 rounded-b-2xl text-red-700"
                        >
                          <p className="hover:scale-110">Logout</p>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => navigate("/auth")}
                    className="px-2 py-1 rounded-lg text-sm sm:text-base transition"
                  >
                    <img src="/icons/sign-in.png" alt="Sign In" className="w-14 h-14 hover:scale-125"/>
                  </button>
                )}
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}