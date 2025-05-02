import { useAuth } from "@/hooks/useAuth";
import useViewportWidth from "@/hooks/useViewPort";
import { useState } from "react";
import { BiHome, BiLogOut, BiMenu } from "react-icons/bi";
import { SiJfrogpipelines } from "react-icons/si";
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
        className="lg:hidden fixed top-2 left-1 z-10 p-2 bg-white dark:bg-black"
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
            <div className="flex items-center mt-1">
              <NavLink
                className="flex items-center gap-2 self-start flex-shrink-0"
                to="/"
                onClick={toggleSidebar}
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
              className="mr-2 mt-1 p-2 text-xl"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="w-full h-full flex flex-col gap-2 overflow-hidden mb-4">
            {/* Profile */}
            <div className="flex flex-col items-start gap-2 h-full mt-4">
              <div className="lg:flex items-center hidden mb-4">
                <NavLink
                  className="flex items-center gap-2 ml-8 md:ml-0 flex-shrink-0"
                  to="/"
                  onClick={toggleSidebar}
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

              {/* Navigation Links */}
              <SidebarNavLink
                to="/"
                label="Home"
                icon={<BiHome size={18} />}
                toggleSidebar={toggleSidebar}
              />
              <SidebarNavLink
                to="/pipelines"
                label="Pipelines"
                toggleSidebar={toggleSidebar}
                icon={<SiJfrogpipelines size={18} />}
              />
            </div>

            {/* Account Links */}
            <div className="flex flex-col items-center gap-1 h-full justify-center lg:justify-end">
              <h3 className="font-medium text-lg self-start">Account</h3>
              <div className="w-full flex items-center dark:bg-[#ffffff13] dark:hover:bg-[#ffffff22] cursor-pointer">
                <button
                  onClick={logout}
                  className="relative cursor-pointer flex items-center gap-2 text-base font-medium whitespace-nowrap border p-2 rounded-md w-full overflow-hidden"
                >
                  <BiLogOut size={18} />
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
  toggleSidebar,
}: {
  to: string;
  label: string;
  icon: any;
  toggleSidebar: any;
}) => (
  <div className="w-full flex items-center group">
    <NavLink
      to={to}
      onClick={toggleSidebar}
      className={({ isActive }: { isActive: boolean }) =>
        `relative flex items-center gap-2 text-base font-medium whitespace-nowrap border p-2 transition-all duration-300 ease-in-out rounded-md w-full overflow-hidden ${
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
