import type { ComponentProps } from "react";
import { Breadcrumbs } from "@aegov/design-system-react";

type AppBreadcrumbsProps = ComponentProps<typeof Breadcrumbs>;

export function AppBreadcrumbs({
  separator = "caret",
  showHomeIcon = true,
  className = "",
  ...props
}: AppBreadcrumbsProps) {
  return (
    <Breadcrumbs
      separator={separator}
      showHomeIcon={showHomeIcon}
      className={`app-breadcrumbs mb-5 ${className}`}
      {...props}
    />
  );
}
