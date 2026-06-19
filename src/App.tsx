import { TooltipProvider } from "@radix-ui/react-tooltip";
import { RouterProvider } from "react-router-dom";
import { ToastProvider } from "./components/common/ToastProvider";
import { router } from "./routes/router";

export default function App() {
  return (
    <TooltipProvider delayDuration={200}>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </TooltipProvider>
  );
}
