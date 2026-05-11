import type { ReactNode } from "react";
import { Toast } from "@aegov/design-system-react";

interface AppToastProps {
  children: ReactNode;
  showToast: boolean;
  duration?: number;
}

export function AppToast({
  children,
  showToast,
  duration = 3200,
}: AppToastProps) {
  return (
    <Toast showToast={showToast} duration={duration}>
      {children}
    </Toast>
  );
}
