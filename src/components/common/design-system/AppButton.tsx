import type { ButtonHTMLAttributes, ReactElement, ReactNode } from "react";
import { Button } from "@aegov/design-system-react";

type AppButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface AppButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "style"
> {
  children: ReactNode;
  variant?: AppButtonVariant;
  asChild?: boolean;
}

export function AppButton({
  children,
  variant = "primary",
  className = "",
  type = "button",
  asChild = false,
  ...props
}: AppButtonProps) {
  const variants: Record<AppButtonVariant, string> = {
    primary: "",
    secondary: "",
    ghost: "",
    danger: "border-aered-600 text-aered-700 hover:bg-aered-50",
  };

  const buttonVariants: Record<
    AppButtonVariant,
    "solid" | "soft" | "link" | "outline"
  > = {
    primary: "solid",
    secondary: "soft",
    ghost: "link",
    danger: "outline",
  };

  const buttonStyles: Record<AppButtonVariant, "primary" | "secondary"> = {
    primary: "primary",
    secondary: "secondary",
    ghost: "secondary",
    danger: "primary",
  };

  if (asChild) {
    return (
      <Button
        asChild
        size="sm"
        style={buttonStyles[variant]}
        variant={buttonVariants[variant]}
        className={`${variants[variant]} ${className}`}
        disabled={props.disabled}
      >
        {children as ReactElement}
      </Button>
    );
  }

  return (
    <Button
      asChild
      size="sm"
      style={buttonStyles[variant]}
      variant={buttonVariants[variant]}
      className={`${variants[variant]} ${className}`}
      disabled={props.disabled}
    >
      <button type={type} {...props}>
        {children}
      </button>
    </Button>
  );
}
