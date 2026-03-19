import React, { Suspense } from "react";
import { createBrowserRouter } from "react-router";
import Loading from "./components/Loading/Loading";
import { AppLayout } from "./AppLayout";

const HomePage = React.lazy(() => import("./pages/Home/HomePage"));
const ErrorPage = React.lazy(() => import("./pages/Error/ErrorPage"));

const withSuspense = (component: React.ReactNode) => (
  <Suspense fallback={<Loading size="6x" />}>{component}</Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: withSuspense(<ErrorPage />),
    children: [
      {
        index: true,
        element: withSuspense(<HomePage />),
      },
      {
        path: "error",
        element: withSuspense(<ErrorPage />),
      },
    ],
  },
]);
