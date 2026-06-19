import { createHashRouter } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { servicesRoutes } from "../features/Services";

export const router = createHashRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: servicesRoutes,
  },
]);
