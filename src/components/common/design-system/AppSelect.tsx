import { CaretDown } from "@phosphor-icons/react";
import { useId } from "react";

interface AppSelectOption {
  disabled?: boolean;
  label: string;
  value: string;
}

interface AppSelectProps {
  className?: string;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  id?: string;
  label?: string;
  onChange?: (value: string) => void;
  options: AppSelectOption[];
  placeholder?: string;
  required?: boolean;
  size?: "sm" | "base" | "lg";
  value?: string;
  variant?: "primary" | "secondary";
}

const sizeClassNames = {
  sm: "h-10 py-2.5 text-sm",
  base: "h-12 py-3 text-base",
  lg: "h-14 py-4 text-lg",
};

export function AppSelect({
  className = "",
  disabled = false,
  error,
  helperText,
  id,
  label,
  onChange,
  options,
  placeholder,
  required = false,
  size = "base",
  value,
}: AppSelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const selectedValue = value ?? "";
  const helperId = helperText || error ? `${selectId}-helper` : undefined;
  const accessibleLabel = label ? undefined : placeholder;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className={`mb-1 block font-medium ${
            size === "lg" ? "text-base" : "text-sm"
          } ${error ? "text-red-600" : "text-gray-900"}`}
        >
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          id={selectId}
          aria-label={accessibleLabel}
          aria-describedby={helperId}
          aria-invalid={Boolean(error)}
          className={`app-select w-full appearance-none rounded-lg bg-whitely-50 px-4 pe-10 text-left shadow-sm outline-none transition ${
            error ? "app-select--error" : ""
          } ${sizeClassNames[size]} ${
            disabled ? "cursor-not-allowed opacity-40" : ""
          } ${className}`}
          disabled={disabled}
          onChange={(event) => onChange?.(event.target.value)}
          required={required}
          value={selectedValue}
        >
          {placeholder && (
            <option value="" disabled={required}>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              disabled={option.disabled}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>

        <CaretDown
          aria-hidden="true"
          className="app-select-caret pointer-events-none text-aegold-700"
          weight="bold"
        />
      </div>

      {(error || helperText) && (
        <p
          id={helperId}
          className={`mt-1 text-sm ${error ? "text-red-600" : "text-gray-500"}`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}
