import Sidebar from "@/components/common/Sidebar";
import { NavLink, Outlet } from "react-router";

const MainLayout = () => {
  return (
    <main className="h-screen w-full flex text-sm dark:bg-black dark:text-white bg-white text-black transition-all duration-300 ease-in-out">
      <Sidebar />
      <section className="flex flex-col items-center h-full w-full scroll overflow-y-auto overflow-x-hidden">
        <div className="bg-white dark:bg-black min-h-14 w-full md:hidden flex justify-center items-center">
          <div className="flex items-center justify-center h-full w-full">
            <NavLink className="flex items-center gap-2" to="/">
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
        </div>
        <div className={"md:w-[calc(100vw-220px)] w-full"}>
          <Outlet />
        </div>
      </section>
    </main>
  );
};

export default MainLayout;
