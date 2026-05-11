import type { RouteObject } from "react-router-dom";
import { FavoritesPage, ServiceDetailsPage, ServicesPage } from "./pages";

export const servicesRoutes: RouteObject[] = [
  {
    index: true,
    element: <ServicesPage />,
  },
  {
    path: "services/:serviceId",
    element: <ServiceDetailsPage />,
  },
  {
    path: "favorites",
    element: <FavoritesPage />,
  },
];
