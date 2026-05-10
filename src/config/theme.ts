import type {
  ServiceCategory,
  ServiceStatus,
  ServiceTag,
} from "../types/service";

export const appTheme = {
  appName: "UAE Services Directory",
  defaultLanguage: "en",
  pageSize: 9,
  debounceDelay: 300,
  apiDelay: 400,
  storageKeys: {
    services: "uae-services",
    language: "uae-services-language",
    theme: "uae-services-theme",
  },
};

export const categories: ServiceCategory[] = [
  "Transport",
  "Identity",
  "Healthcare",
  "Business",
  "Utilities",
  "Housing",
  "Education",
  "Employment",
  "Family",
  "Tourism",
];

export const statuses: ServiceStatus[] = [
  "Available",
  "Limited",
  "Maintenance",
];

export const tags: ServiceTag[] = [
  "Individuals",
  "Business",
  "Renewal",
  "Application",
  "Appointment",
  "Certificate",
  "Payment Required",
  "Free",
  "Online",
  "Popular",
];
