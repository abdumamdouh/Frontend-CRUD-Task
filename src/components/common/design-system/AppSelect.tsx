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

const fieldSizeClassNames = {
  sm: "h-10",
  base: "h-12",
  lg: "h-14",
};

const textSizeClassNames = {
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
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
        <div
          className={`app-field relative flex items-center rounded-lg bg-whitely-50 ${fieldSizeClassNames[size]} ${
            error ? "bg-red-50 app-select--error" : ""
          } ${disabled ? "opacity-40" : ""} ${className}`}
        >
          <select
            id={selectId}
            aria-label={accessibleLabel}
            aria-describedby={helperId}
            aria-invalid={Boolean(error)}
            className={`app-select h-full w-full flex-1 appearance-none border-0 bg-transparent px-4 pe-10 text-left text-gray-900 outline-none transition focus:ring-0 disabled:cursor-not-allowed ${textSizeClassNames[size]}`}
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
        </div>

        <CaretDown
          aria-hidden="true"
          className="app-select-caret pointer-events-none text-gray-400"
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
