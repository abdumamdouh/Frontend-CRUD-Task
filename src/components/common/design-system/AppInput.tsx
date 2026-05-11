import { useId } from "react";
import type { ComponentProps } from "react";
import { Input } from "@aegov/design-system-react";

type AppInputProps = ComponentProps<typeof Input>;

export function AppInput({
  id,
  variant = "secondary",
  className = "",
  placeholder,
  ...props
}: AppInputProps) {
  const generatedId = useId();
  const inputId = id ?? (props.label ? generatedId : undefined);

  return (
    <Input
      id={inputId}
      variant={variant}
      className={`app-field ${className}`}
      placeholder={placeholder}
      {...props}
    />
  );
}
