import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();

  // Detect saved theme OR system theme
  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark" ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches &&
        !localStorage.getItem("theme"))
  );

  // Apply dark mode class to HTML tag
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <nav className="w-full bg-white dark:bg-gray-800 shadow-md py-4 px-6 flex justify-between items-center fixed top-0 left-0 z-50 transition">

      {/* Logo */}
      <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400 select-none">
        CKW App
      </h1>

      {/* Right section */}
      <div className="flex items-center gap-6">

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDark(!dark)}
          className="text-2xl cursor-pointer transition"
        >
          {dark ? "☀️" : "🌙"}
        </button>

        {/* User Greeting */}
        {user && (
          <span className="text-gray-700 dark:text-gray-300 hidden sm:block">
            Hello, <strong>{user.name}</strong>
          </span>
        )}

        {/* Profile */}
        {user && (
          <Link
            to="/profile"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition"
          >
            Profile
          </Link>
        )}

        {/* Change Password */}
        {user && (
          <Link
            to="/change-password"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition"
          >
            Change Password
          </Link>
        )}

        {/* Logout */}
        {user && (
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition active:scale-95"
          >
            Logout
          </button>
        )}

      </div>
    </nav>
  );
};

export default Navbar;
