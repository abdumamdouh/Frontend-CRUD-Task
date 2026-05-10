import type { ComponentProps } from "react";
import { Card } from "@aegov/design-system-react";

type AppCardProps = ComponentProps<typeof Card>;

export function AppCard({ variant = "default", ...props }: AppCardProps) {
  return <Card variant={variant} {...props} />;
}
