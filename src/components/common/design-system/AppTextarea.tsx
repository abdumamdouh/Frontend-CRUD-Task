import { useId } from "react";
import type { ComponentProps } from "react";
import { Textarea } from "@aegov/design-system-react";

interface AppTextareaProps extends ComponentProps<typeof Textarea> {
  maxLength?: number;
  showCount?: boolean;
}

export function AppTextarea({
  id,
  variant = "secondary",
  className = "",
  placeholder,
  value,
  maxLength,
  showCount = false,
  ...props
}: AppTextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? (props.label ? generatedId : undefined);
  const currentLength = typeof value === "string" ? value.length : 0;

  return (
    <div className="relative">
      <Textarea
        id={textareaId}
        variant={variant}
        className={`app-field ${showCount ? "pb-8" : ""} ${className}`}
        placeholder={placeholder}
        value={value}
        maxLength={maxLength}
        {...props}
      />

      {showCount && maxLength && (
        <span className="app-textarea-counter pointer-events-none absolute bottom-2 end-3 rounded bg-whitely-50/90 px-2 py-0.5 text-xs font-medium text-slate-500">
          {currentLength}/{maxLength}
        </span>
      )}
    </div>
  );
}
