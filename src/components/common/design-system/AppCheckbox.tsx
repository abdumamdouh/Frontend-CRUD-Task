import type { ComponentProps } from "react";
import { Checkbox } from "@aegov/design-system-react";

type AppCheckboxProps = ComponentProps<typeof Checkbox>;

export function AppCheckbox({
  variant = "secondary",
  size = "sm",
  className = "",
  ...props
}: AppCheckboxProps) {
  return (
    <Checkbox
      variant={variant}
      size={size}
      className={`app-checkbox ${className}`}
      {...props}
    />
  );
}
