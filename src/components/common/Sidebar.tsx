import { BiCrown, BiHome, BiLogOut, BiUser } from "react-icons/bi";
import { FaTools } from "react-icons/fa";
import { GrProjects } from "react-icons/gr";
import { NavLink } from "react-router";

const Sidebar = () => {
  return (
    <div className="fixed w-full lg:w-min lg:static z-30 flex justify-start h-screen dark:border-r dark:border-slate-50">
      <div className="h-full flex flex-col items-center justify-center gap-2 transition-all duration-300 ease-in-out w-64 px-3 lg:w-64">
        <div className="w-full h-full max-h-[90%]">
          <div className="flex flex-col items-start relative w-full">
            {/* Logo */}
            <div className="lg:hidden">
              <img
                alt="Logo"
                width="56"
                height="40"
                className="hidden"
                src="/mr-beast-logo.svg"
              />
              <img
                alt="Logo"
                width="56"
                height="40"
                className="block"
                src="/mr-beast-logo.svg"
              />
            </div>

            {/* Collapse Button */}
            <button
              title="Collapse"
              className="absolute -top-4 right-1 z-10 border p-2 rounded-full focus:outline-none lg:hidden"
            >
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                height="16"
                width="16"
              >
                <path d="M17 12H3"></path>
                <path d="m11 18 6-6-6-6"></path>
                <path d="M21 5v14"></path>
              </svg>
            </button>
          </div>

          <div className="w-full h-full max-h-[100%] flex flex-col gap-2 overflow-hidden">
            {/* Profile */}
            <div className="flex flex-col items-center gap-2 h-full justify-center">
              <div className="w-full flex items-center group">
                <button className="flex items-center gap-4 font-semibold capitalize whitespace-nowrap transition-all duration-300 ease-in-out rounded-md border p-2 w-full overflow-hidden">
                  <img
                    src="https://lh3.googleusercontent.com/a/ACg8ocI5ZER5vyWOULrWkR6Gp8_c-SXkd355X5MVYUUpMD_DB7jx86Q=s96-c"
                    className="rounded-full w-8"
                    alt="profile"
                  />
                  Yeasin Shamim
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
              <div className="w-full flex items-center group dark:bg-[#ffffff13] dark:hover:bg-[#ffffff22] cursor-pointer">
                <button className="relative flex items-center gap-4 font-medium whitespace-nowrap border p-2 transition-all duration-300 ease-in-out rounded-md w-full overflow-hidden">
                  <div className="flex-shrink-0 cursor-pointer">
                    <BiLogOut size={16} />
                  </div>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
        `relative flex items-center gap-4 dark:bg-[#000] dark:hover:bg-[#ffffff2f] font-medium whitespace-nowrap border p-2 transition-all duration-300 ease-in-out rounded-md w-full overflow-hidden ${
          isActive
            ? "dark:border-white dark:bg-[#ffffff4a]"
            : "dark:border-gray-100 dark:hover:border-gray-100"
        }`
      }
    >
      <div className="flex-shrink-0">{icon}</div>
      <span>{label}</span>
    </NavLink>
  </div>
);

export default Sidebar;
