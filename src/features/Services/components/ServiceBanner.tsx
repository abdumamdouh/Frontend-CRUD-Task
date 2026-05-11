import { useTranslation } from "react-i18next";
import type { Service } from "../types/service";
import {
  getServiceBannerLabel,
  getServiceBannerTheme,
} from "../utils/serviceImages";
import { getLocalizedService } from "../utils/serviceTranslations";

interface ServiceBannerProps {
  service: Service;
  size?: "card" | "details";
}

export function ServiceBanner({ service, size = "card" }: ServiceBannerProps) {
  const { t, i18n } = useTranslation();

  const localizedService = getLocalizedService(service, i18n.language);
  const theme = getServiceBannerTheme(service.category);
  const label = getServiceBannerLabel(service.category, i18n.language);

  const heightClass = size === "details" ? "h-32 sm:h-36" : "h-32";

  const textClass =
    size === "details"
      ? "text-3xl sm:text-4xl"
      : "text-2xl sm:text-3xl lg:text-4xl";

  return (
    <div
      role="img"
      aria-label={t("serviceImageAlt", { title: localizedService.title })}
      className={`service-banner ${heightClass} grid w-full place-items-center rounded-md px-5 text-center`}
      style={{
        backgroundColor: `#${theme.background}`,
        color: `#${theme.text}`,
      }}
    >
      <span className={`${textClass} max-w-full font-bold leading-tight`}>
        {label}
      </span>
    </div>
  );
}
