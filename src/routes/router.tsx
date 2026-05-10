import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { FavoritesPage } from "../pages/FavoritesPage";
import { ServiceDetailsPage } from "../pages/ServiceDetailsPage";
import { ServicesPage } from "../pages/ServicesPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
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
    ],
  },
]);
