import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { servicesRoutes } from "../features/Services";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: servicesRoutes,
  },
]);
