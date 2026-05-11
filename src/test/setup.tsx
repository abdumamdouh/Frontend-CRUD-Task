import "@testing-library/jest-dom";
import React from "react";
import { vi } from "vitest";

vi.mock("@aegov/design-system-react", () => ({
  Button: ({
    asChild,
    children,
    style,
    variant,
    size,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean;
    children: React.ReactNode;
    style?: "primary" | "secondary";
    variant?: "solid" | "soft" | "link" | "outline";
    size?: "xs" | "sm" | "base" | "lg";
  }) => {
    void style;
    void variant;
    void size;

    return asChild && React.isValidElement(children) ? (
      children
    ) : (
      <button {...props}>{children}</button>
    );
  },
  Input: ({
    label,
    error,
    ...props
  }: React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    error?: string;
  }) => (
    <label>
      {label}
      <input {...props} />
      {error ? <span>{error}</span> : null}
    </label>
  ),
  Textarea: ({
    label,
    error,
    ...props
  }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string;
    error?: string;
  }) => (
    <label>
      {label}
      <textarea {...props} />
      {error ? <span>{error}</span> : null}
    </label>
  ),
  Select: ({
    label,
    value,
    onChange,
    options,
    placeholder,
    error,
  }: {
    label?: string;
    value?: string;
    onChange?: (value: string) => void;
    options: Array<{ value: string; label: string }>;
    placeholder?: string;
    error?: string;
  }) => (
    <label>
      {label || placeholder}
      <select
        value={value || ""}
        onChange={(event) => onChange?.(event.target.value)}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <span>{error}</span> : null}
    </label>
  ),
  Checkbox: ({
    checked,
    onCheckedChange,
    label,
  }: {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    label?: string;
  }) => (
    <label>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onCheckedChange?.(event.target.checked)}
      />
      {label}
    </label>
  ),
  Card: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Toggle: ({
    checked,
    onCheckedChange,
    label,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    label?: string;
  }) => (
    <button
      type="button"
      aria-pressed={checked}
      onClick={() => onCheckedChange?.(!checked)}
      {...props}
    >
      {label}
    </button>
  ),
  Modal: ({
    children,
    title,
  }: {
    children: React.ReactNode;
    title?: string;
  }) => (
    <div role="dialog" aria-label={title}>
      {children}
    </div>
  ),
  Pagination: () => null,
  Toast: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
