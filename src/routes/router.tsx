import MainLayout from "@/layout/MainLayout";
import Home from "@/pages/Home";
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: Home },

      // {
      //   path: "concerts",
      //   children: [
      //     { index: true, Component: ConcertsHome },
      //     { path: ":city", Component: ConcertsCity },
      //     { path: "trending", Component: ConcertsTrending },
      //   ],
      // },
    ],
  },
]);
