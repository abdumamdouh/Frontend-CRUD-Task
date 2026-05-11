import type {
  ServiceCategory,
  ServiceStatus,
  ServiceTag,
} from "../types/service";

export const categoryBadgeClass: Record<ServiceCategory, string> = {
  Transport: "border-seablue-100 bg-seablue-50 text-seablue-800",
  Identity: "border-secondary-100 bg-secondary-50 text-secondary-800",
  Healthcare: "border-aegreen-100 bg-aegreen-50 text-aegreen-800",
  Business: "border-primary-100 bg-primary-50 text-primary-800",
  Utilities: "border-seablue-100 bg-seablue-50 text-seablue-800",
  Housing: "border-aegreen-100 bg-aegreen-50 text-aegreen-800",
  Education: "border-techblue-100 bg-techblue-50 text-techblue-800",
  Employment: "border-secondary-100 bg-secondary-50 text-secondary-800",
  Family: "border-aered-100 bg-aered-50 text-aered-800",
  Tourism: "border-primary-100 bg-primary-50 text-primary-800",
};

export const statusBadgeClass: Record<ServiceStatus, string> = {
  Available: "border-aegreen-100 bg-aegreen-50 text-aegreen-800",
  Limited: "border-primary-100 bg-primary-50 text-primary-800",
  Maintenance: "border-aered-100 bg-aered-50 text-aered-800",
};

export const tagBadgeClass: Record<ServiceTag, string> = {
  Vehicles: "border-seablue-100 bg-seablue-50 text-seablue-800",
  Individuals: "border-aegreen-100 bg-aegreen-50 text-aegreen-800",
  Business: "border-secondary-100 bg-secondary-50 text-secondary-800",
  Renewal: "border-techblue-100 bg-techblue-50 text-techblue-800",
  Application: "border-seablue-100 bg-seablue-50 text-seablue-800",
  Appointment: "border-primary-100 bg-primary-50 text-primary-800",
  Certificate: "border-techblue-100 bg-techblue-50 text-techblue-800",
  "Payment Required": "border-primary-100 bg-primary-50 text-primary-800",
  Free: "border-aegreen-100 bg-aegreen-50 text-aegreen-800",
  Online: "border-seablue-100 bg-seablue-50 text-seablue-800",
  Popular: "border-aered-100 bg-aered-50 text-aered-800",
};
