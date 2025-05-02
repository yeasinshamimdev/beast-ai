import CommonLoading from "@/components/loading/CommonLoading";
import FlowCanvas from "@/components/pipeline/FlowCanvas";
import PrivateRoute from "@/hooks/privateRoute";
import MainLayout from "@/layout/MainLayout";
import ErrorPage from "@/pages/ErrorPage";
import Home from "@/pages/Home";
import LoginPage from "@/pages/Login";
import Pipelines from "@/pages/Pipelines";
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PrivateRoute element={<MainLayout />} />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, Component: Home },
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
