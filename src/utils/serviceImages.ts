import type { Service, ServiceCategory } from "../types/service";
import { translateCategory } from "./serviceTranslations";

const categoryColors: Record<
  ServiceCategory,
  { background: string; text: string }
> = {
  Transport: { background: "eef7fb", text: "315f70" },
  Identity: { background: "f0f3fb", text: "454b75" },
  Healthcare: { background: "edf8f0", text: "2f6840" },
  Business: { background: "f3f3f4", text: "4b4f58" },
  Utilities: { background: "edf8fa", text: "2f6370" },
  Housing: { background: "edf7f4", text: "2f665f" },
  Education: { background: "eef5fb", text: "345f86" },
  Employment: { background: "f3f3f4", text: "4b4f58" },
  Family: { background: "fbf0f0", text: "843a38" },
  Tourism: { background: "fbf6e8", text: "76571f" },
};

export const getServiceImageUrl = (
  service: Pick<Service, "category" | "title">,
  width = 960,
  height = 540,
  language = "en",
) => {
  const colors = categoryColors[service.category];
  const category = translateCategory(service.category, language);
  const label = encodeURIComponent(
    language.startsWith("ar") ? `خدمة ${category}` : `${category} Service`,
  );
  return `https://placehold.co/${width}x${height}/${colors.background}/${colors.text}/png?text=${label}`;
};

export const getServiceBannerTheme = (
  category: ServiceCategory,
): { background: string; text: string } => categoryColors[category];

export const getServiceBannerLabel = (
  category: ServiceCategory,
  language = "en",
) => {
  const translatedCategory = translateCategory(category, language);
  return language.startsWith("ar")
    ? `خدمة ${translatedCategory}`
    : `${translatedCategory} Service`;
};
