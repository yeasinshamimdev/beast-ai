import Navbar from "@/components/common/Navbar";
import Sidebar from "@/components/common/Sidebar";
import { Outlet } from "react-router";

const MainLayout = () => {
  return (
    <main className="h-screen w-full flex text-sm dark:bg-black dark:text-white bg-white text-black transition-all duration-300 ease-in-out">
      <Sidebar />
      <section className="flex flex-col items-center h-full w-full scroll overflow-y-auto">
        <Navbar />
        <Outlet />
      </section>
    </main>
  );
};

export default MainLayout;
