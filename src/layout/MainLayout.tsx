import { Outlet } from "react-router";
import Footer from "../components/common/Footer";
import Navbar from "../components/common/Navbar";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default MainLayout;
