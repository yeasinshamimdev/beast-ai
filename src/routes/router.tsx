import CommonLoading from "@/components/loading/CommonLoading";
import FlowCanvas from "@/components/pipeline/FlowCanvas";
import MainLayout from "@/layout/MainLayout";
import AIApps from "@/pages/AIApps";
import ErrorPage from "@/pages/ErrorPage";
import Home from "@/pages/Home";
import LoginPage from "@/pages/Login";
import MyProjects from "@/pages/MyProjects";
import Pipelines from "@/pages/Pipelines";
import Profile from "@/pages/Profile";
import Subscription from "@/pages/Subscription";
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    errorElement: <ErrorPage />,
    children: [
      { index: true, Component: Home },
      {
        path: "my-projects",
        Component: MyProjects,
        hydrateFallbackElement: <CommonLoading />,
      },
      {
        path: "profile",
        Component: Profile,
        hydrateFallbackElement: <CommonLoading />,
      },
      {
        path: "ai-apps",
        Component: AIApps,
        hydrateFallbackElement: <CommonLoading />,
      },
      {
        path: "subscription",
        Component: Subscription,
        hydrateFallbackElement: <CommonLoading />,
      },
      {
        path: "pipelines",
        hydrateFallbackElement: <CommonLoading />,
        children: [
          {
            index: true,
            Component: Pipelines,
          },
          {
            path: ":id",
            Component: FlowCanvas,
            hydrateFallbackElement: <CommonLoading />,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    Component: LoginPage,
    errorElement: <ErrorPage />,
  },
]);
