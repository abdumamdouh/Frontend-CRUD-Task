import {
  cloneElement,
  isValidElement,
  type ButtonHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
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

const variantClasses: Record<AppButtonVariant, string> = {
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

export function AppButton({
  children,
  variant = "primary",
  className = "",
  type = "button",
  asChild = false,
  ...props
}: AppButtonProps) {
  const mergedClassName = `${variantClasses[variant]} ${className}`.trim();

  const buttonProps = {
    asChild: true as const,
    size: "sm" as const,
    style: buttonStyles[variant],
    variant: buttonVariants[variant],
    className: mergedClassName,
    disabled: props.disabled,
  };

  if (asChild) {
    if (!isValidElement(children)) return null;

    const child = cloneElement(children as ReactElement, {
      ...props,
    });

    return <Button {...buttonProps}>{child}</Button>;
  }

  return (
    <Button {...buttonProps}>
      <button type={type} {...props}>
        {children}
      </button>
    </Button>
  );
}
