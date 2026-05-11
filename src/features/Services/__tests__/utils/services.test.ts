import { describe, expect, it } from "vitest";
import { initialServices } from "../../data/initialServices";
import type { ServiceFilters } from "../../types";
import {
  filterServices,
  getPageCount,
  paginate,
  sortServices,
} from "../../utils";

const baseFilters: ServiceFilters = {
  searchTerm: "",
  category: "",
  statuses: [],
  tags: [],
  popularOnly: false,
};

describe("service list utilities", () => {
  it("searches services by title", () => {
    const result = filterServices(initialServices, {
      ...baseFilters,
      searchTerm: "passport",
    });
    expect(result.map((service) => service.title)).toContain(
      "Passport Renewal",
    );
  });

  it("searches services by description", () => {
    const result = filterServices(initialServices, {
      ...baseFilters,
      searchTerm: "electricity",
    });
    expect(
      result.some((service) => service.title === "Utility Connection"),
    ).toBe(true);
  });

  it("searches localized Arabic service data", () => {
    const result = filterServices(
      initialServices,
      {
        ...baseFilters,
        searchTerm: "شكوى",
      },
      "ar",
    );

    expect(result.map((service) => service.id)).toEqual(
      expect.arrayContaining(["service-042", "service-048"]),
    );
  });

  it("filters by category, status, and tag together", () => {
    const result = filterServices(initialServices, {
      ...baseFilters,
      category: "Transport",
      statuses: ["Available"],
      tags: ["Vehicles"],
    });

    expect(result.length).toBeGreaterThan(0);
    expect(result.every((service) => service.category === "Transport")).toBe(
      true,
    );
    expect(result.every((service) => service.status === "Available")).toBe(
      true,
    );
    expect(result.every((service) => service.tags.includes("Vehicles"))).toBe(
      true,
    );
  });

  it("sorts by fee from low to high", () => {
    const sorted = sortServices(initialServices, "fee-low");
    expect(sorted[0].fee).toBeLessThanOrEqual(sorted[sorted.length - 1].fee);
  });

  it("paginates 10 services per page", () => {
    expect(paginate(initialServices, 1, 10)).toHaveLength(10);
    expect(getPageCount(initialServices.length, 10)).toBe(5);
  });
});
