import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Sidebar = () => {
  const { logout } = useAuth();

 const linkStyle =
  "block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition";

  const activeStyle =
    "bg-blue-600 text-white hover:bg-blue-700";

  return (
    <div className="w-64 bg-white dark:bg-gray-800 dark:text-gray-200 h-full shadow-xl p-6 fixed left-0 top-16 transition">


      <nav className="flex flex-col gap-3">

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? `${linkStyle} ${activeStyle}` : linkStyle
          }
        >
           Dashboard
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive ? `${linkStyle} ${activeStyle}` : linkStyle
          }
        >
           Profile
        </NavLink>

        <NavLink
          to="/change-password"
          className={({ isActive }) =>
            isActive ? `${linkStyle} ${activeStyle}` : linkStyle
          }
        >
           Change Password
        </NavLink>

        <button
          onClick={logout}
          className="mt-4 bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>

      </nav>
    </div>
  );
};

export default Sidebar;
