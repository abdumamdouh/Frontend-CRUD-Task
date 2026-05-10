import type { ComponentProps } from "react";
import { Toggle } from "@aegov/design-system-react";

type AppToggleProps = ComponentProps<typeof Toggle>;

export function AppToggle({
  variant = "default",
  className = "",
  ...props
}: AppToggleProps) {
  return (
    <Toggle
      variant={variant}
      className={`rounded-full ${className}`}
      {...props}
    />
  );
}
