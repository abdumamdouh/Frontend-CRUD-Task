import { beforeEach, describe, expect, it, vi } from "vitest";
import { appTheme } from "../../../../config/theme";
import { servicesApi } from "../../services";
import type { Service } from "../../types";
import { getLocalizedService } from "../../utils/serviceTranslations";

describe("servicesApi", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  it("toggles favorite state and persists it", async () => {
    const promise = servicesApi.toggleFavorite("service-001");
    await vi.runAllTimersAsync();
    const services = await promise;

    expect(
      services.find((service) => service.id === "service-001")?.isFavorite,
    ).toBe(true);

    const saved = JSON.parse(
      localStorage.getItem(appTheme.storageKeys.services) ?? "[]",
    ) as Service[];
    expect(
      saved.find((service) => service.id === "service-001")?.isFavorite,
    ).toBe(true);
  });

  it("updates Arabic title and description as localized service data", async () => {
    const promise = servicesApi.updateService(
      "service-048",
      {
        title: "شكوى تجارية معدلة",
        description: "وصف عربي معدل للخدمة التجارية.",
        category: "Business",
        status: "Available",
        tags: ["Application", "Individuals", "Free"],
        processingTime: 12,
        fee: 0,
        isPopular: false,
      },
      "ar",
    );
    await vi.runAllTimersAsync();
    const services = await promise;
    const service = services.find((item) => item.id === "service-048");

    expect(service?.title).toBe("Commercial Complaint");
    expect(service?.translations?.ar?.title).toBe("شكوى تجارية معدلة");
    expect(getLocalizedService(service as Service, "ar").title).toBe(
      "شكوى تجارية معدلة",
    );
  });
});
