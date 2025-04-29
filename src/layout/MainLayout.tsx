import Navbar from "@/components/common/Navbar";
import Sidebar from "@/components/common/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import LoginPage from "@/pages/Login";
import { Outlet } from "react-router";

const MainLayout = () => {
  const { user } = useAuth();

  if (!user) return <LoginPage />;

  return (
    <main className="h-screen w-full flex text-sm dark:bg-black dark:text-white bg-white text-black transition-all duration-300 ease-in-out">
      <Sidebar />
      <section className="flex flex-col items-center h-full w-full scroll overflow-y-auto">
        <Navbar />
        <div className="md:w-[calc(100vw-220px)]">
          <Outlet />
        </div>
      </section>
    </main>
  );
};

export default MainLayout;
