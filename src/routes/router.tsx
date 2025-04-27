import MainLayout from "@/layout/MainLayout";
import AIApps from "@/pages/AIApps";
import Home from "@/pages/Home";
import MyProjects from "@/pages/MyProjects";
import Profile from "@/pages/Profile";
import Subscription from "@/pages/Subscription";
import { createBrowserRouter, Link } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    errorElement: (
      <div className="w-full flex flex-col items-center justify-center -mt-10 min-h-screen">
        <h1 className="text-center text-4xl text-blue-400">404</h1>
        <p className="text-center text-lg">
          The page you are looking for is not available
        </p>
        <Link
          to={"/"}
          className="dark:bg-black px-4 py-2 dark:text-white mt-4 rounded-xl"
        >
          Back to home page
        </Link>
      </div>
    ),
    children: [
      { index: true, Component: Home },
      {
        path: "my-projects",
        Component: MyProjects,
        hydrateFallbackElement: (
          <div className="h-20 w-full text-center">
            <h1>Loading...</h1>
          </div>
        ),
      },
      {
        path: "profile",
        Component: Profile,
        hydrateFallbackElement: (
          <div className="h-20 w-full text-center">
            <h1>Loading...</h1>
          </div>
        ),
      },
      {
        path: "ai-apps",
        Component: AIApps,
        hydrateFallbackElement: (
          <div className="h-20 w-full text-center">
            <h1>Loading...</h1>
          </div>
        ),
      },
      {
        path: "subscription",
        Component: Subscription,
        hydrateFallbackElement: (
          <div className="h-20 w-full text-center">
            <h1>Loading...</h1>
          </div>
        ),
      },
    ],
  },
]);
