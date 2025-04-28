import { useAuth } from "@/hooks/useAuth";
import useViewportWidth from "@/hooks/useViewPort";
import { useState } from "react";
import {
  BiCrown,
  BiHome,
  BiLogOut,
  BiMenu,
  BiUser,
  BiUserCircle,
} from "react-icons/bi";
import { FaTools } from "react-icons/fa";
import { GrProjects } from "react-icons/gr";
import { NavLink } from "react-router";

const Sidebar = () => {
  const width = useViewportWidth();
  const { logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(width >= 1024);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <>
      {/* Hamburger Menu for Mobile */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-5 left-1 z-10 p-2 bg-white dark:bg-black"
      >
        <BiMenu size={26} />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed z-30 top-0 left-0 h-screen transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static w-64 border-r border-slate-200 dark:border-slate-50 bg-white dark:bg-black`}
      >
        <div className="h-full flex flex-col items-center justify-center gap-2 px-3">
          {/* Collapse Button for Mobile */}
          <div className="flex justify-between items-center w-full lg:hidden">
            <div className="flex items-center">
              <NavLink
                className="flex items-center gap-2 self-start flex-shrink-0"
                to="/"
              >
                <img
                  alt="Logo"
                  width="44"
                  height="44"
                  className=""
                  src="/mr-beast-logo.svg"
                />{" "}
                <span className="font-semibold text-xl">BeastAI</span>
              </NavLink>
            </div>
            <button
              title="Collapse"
              onClick={toggleSidebar}
              className="mr-2 p-2 text-xl"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="w-full h-full flex flex-col gap-2 overflow-hidden">
            {/* Profile */}
            <div className="flex flex-col items-center gap-2 h-full mt-4">
              <div className="w-full flex items-center group">
                <button className="flex items-center gap-4 font-semibold capitalize whitespace-nowrap rounded-md border p-2 w-full overflow-hidden">
                  {/* <img
                    src=""
                    className="rounded-full w-8"
                    alt="profile"
                  /> */}
                  <BiUserCircle size={30} />
                  Mr Beast
                </button>
              </div>

              <h3 className="font-medium text-lg self-start">Create</h3>

              {/* Navigation Links */}
              <SidebarNavLink to="/" label="Home" icon={<BiHome size={16} />} />
              <SidebarNavLink
                to="/my-projects"
                label="My Projects"
                icon={<GrProjects size={14} />}
              />
              <SidebarNavLink
                to="/profile"
                label="Profile"
                icon={<BiUser size={16} />}
              />
              <SidebarNavLink
                to="/ai-apps"
                label="AI Apps"
                icon={<FaTools size={14} />}
              />
            </div>

            {/* Account Links */}
            <div className="flex flex-col items-center gap-2 h-full justify-center lg:justify-end">
              <h3 className="font-medium text-lg self-start">Account</h3>
              <SidebarNavLink
                to="/subscription"
                label="Subscription"
                icon={<BiCrown size={16} />}
              />
              <div className="w-full flex items-center dark:bg-[#ffffff13] dark:hover:bg-[#ffffff22] cursor-pointer">
                <button
                  onClick={logout}
                  className="relative flex items-center gap-4 font-medium whitespace-nowrap border p-2 rounded-md w-full overflow-hidden"
                >
                  <BiLogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Reusable Sidebar NavLink Component
const SidebarNavLink = ({
  to,
  label,
  icon,
}: {
  to: string;
  label: string;
  icon: any;
}) => (
  <div className="w-full flex items-center group">
    <NavLink
      to={to}
      className={({ isActive }: { isActive: boolean }) =>
        `relative flex items-center gap-4 font-medium whitespace-nowrap border p-2 transition-all duration-300 ease-in-out rounded-md w-full overflow-hidden ${
          isActive
            ? "dark:border-white dark:bg-[#ffffff4a] bg-[#0303033a]"
            : "dark:border-gray-100 dark:hover:border-gray-100 dark:hover:bg-[#ffffff2f] hover:bg-[#2c2b2b4c]"
        }`
      }
    >
      <div className="flex-shrink-0">{icon}</div>
      <span>{label}</span>
    </NavLink>
  </div>
);

export default Sidebar;
