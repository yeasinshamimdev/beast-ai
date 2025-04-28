import CommonLoading from "@/components/loading/CommonLoading";
import Pipelines from "@/pages/Pipelines";
import MainLayout from "@/layout/MainLayout";
import AIApps from "@/pages/AIApps";
import ErrorPage from "@/pages/ErrorPage";
import Home from "@/pages/Home";
import MyProjects from "@/pages/MyProjects";
import Profile from "@/pages/Profile";
import Subscription from "@/pages/Subscription";
import { createBrowserRouter } from "react-router";
import FlowCanvas from "@/components/pipeline/FlowCanvas";

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
        Component: Pipelines,
        hydrateFallbackElement: <CommonLoading />,
        // children: [
        //   {
        //     path: ":id",
        //     Component: FlowCanvas,
        //     hydrateFallbackElement: <CommonLoading />,
        //   },
        // ],
      },
      {
        path: "pipelines/:id",
        Component: FlowCanvas,
        hydrateFallbackElement: <CommonLoading />,
      },
    ],
  },
]);
