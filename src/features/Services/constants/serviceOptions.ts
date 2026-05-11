import type {
  ServiceCategory,
  ServiceStatus,
  ServiceTag,
} from "../types/service";

export const serviceCategories: ServiceCategory[] = [
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

export const serviceStatuses: ServiceStatus[] = [
  "Available",
  "Limited",
  "Maintenance",
];

export const serviceTags: ServiceTag[] = [
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

export const serviceSortOptions = [
  "newest",
  "oldest",
  "title-az",
  "title-za",
  "processing-time",
  "fee-low",
  "fee-high",
] as const;

export const categories = serviceCategories;
export const statuses = serviceStatuses;
export const tags = serviceTags;
export const sortOptions = serviceSortOptions;
