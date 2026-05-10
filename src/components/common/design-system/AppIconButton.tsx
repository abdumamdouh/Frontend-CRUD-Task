import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Button } from "@aegov/design-system-react";

type IconButtonTone = "neutral" | "primary" | "danger";

interface AppIconButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "style" | "children"
> {
  label: string;
  icon: ReactNode;
  tone?: IconButtonTone;
}

const toneClasses: Record<IconButtonTone, string> = {
  neutral:
    "border-secondary-100 bg-white text-secondary-800 hover:border-secondary-200 hover:bg-secondary-50 focus-visible:ring-secondary-300",
  primary:
    "border-primary-100 bg-primary-50 text-primary-700 hover:bg-primary-100 focus-visible:ring-primary-300",
  danger:
    "border-aered-100 bg-aered-50 text-aered-700 hover:bg-aered-100 focus-visible:ring-aered-300",
};

export function AppIconButton({
  label,
  icon,
  tone = "neutral",
  className = "",
  type = "button",
  ...props
}: AppIconButtonProps) {
  return (
    <Button
      asChild
      isIcon
      size="sm"
      style={tone === "danger" ? "primary" : "secondary"}
      variant="soft"
      className={`h-10 w-10 rounded-full border p-0 ${toneClasses[tone]} ${className}`}
      disabled={props.disabled}
    >
      <button type={type} aria-label={label} {...props}>
        <span className="grid h-full w-full place-items-center [&>svg]:h-[18px] [&>svg]:w-[18px]">
          {icon}
        </span>
      </button>
    </Button>
  );
}
