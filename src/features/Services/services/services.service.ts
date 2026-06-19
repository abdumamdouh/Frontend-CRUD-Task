import { appTheme } from "../../../config/theme";
import { initialServices } from "../data/initialServices";
import type { Service, ServicePayload } from "../types/service";
import { liferayObjectApi } from "./liferayObjectApi";

const { services: servicesKey } = appTheme.storageKeys;

const delay = (ms = appTheme.apiDelay) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const initialServicesById = new Map(
  initialServices.map((service) => [service.id, service]),
);

const migrateServices = (services: Service[]) => {
  let hasChanges = false;

  const nextServices = services.map((service) => {
    const initialService = initialServicesById.get(service.id);
    if (!initialService) return service;

    const hasLegacyShortDescription =
      service.description.length < initialService.description.length &&
      initialService.description.startsWith(service.description);
    if (!hasLegacyShortDescription) return service;

    hasChanges = true;
    return {
      ...service,
      description: initialService.description,
    };
  });

  return { hasChanges, nextServices };
};

const readServices = (): Service[] => {
  const saved = localStorage.getItem(servicesKey);
  if (!saved) {
    localStorage.setItem(servicesKey, JSON.stringify(initialServices));
    return clone(initialServices);
  }

  try {
    const parsedServices = JSON.parse(saved) as Service[];
    const { hasChanges, nextServices } = migrateServices(parsedServices);
    if (hasChanges) {
      localStorage.setItem(servicesKey, JSON.stringify(nextServices));
    }
    return clone(nextServices);
  } catch {
    localStorage.setItem(servicesKey, JSON.stringify(initialServices));
    return clone(initialServices);
  }
};

const saveServices = (services: Service[]): Service[] => {
  localStorage.setItem(servicesKey, JSON.stringify(services));
  return clone(services);
};

const tryLiferayObjectApi = async (
  operation: () => Promise<Service[]>,
  fallback: () => Promise<Service[]> | Service[],
) => {
  try {
    return await operation();
  } catch {
    return fallback();
  }
};

const makeService = (payload: ServicePayload): Service => {
  const processingTime = Number(payload.processingTime);
  const fee = Number(payload.fee);

  return {
    ...payload,
    id: `service-${crypto.randomUUID()}`,
    processingTime,
    processingTimeLabel: `${processingTime} minutes`,
    fee,
    feeLabel: fee === 0 ? "Free" : String(fee),
    isFavorite: false,
    createdAt: new Date().toISOString(),
  };
};

export const servicesApi = {
  async getServices(): Promise<Service[]> {
    await delay();
    return tryLiferayObjectApi(
      () => liferayObjectApi.getServices(),
      () => readServices(),
    );
  },

  async createService(payload: ServicePayload): Promise<Service[]> {
    await delay();
    return tryLiferayObjectApi(
      () => liferayObjectApi.createService(payload),
      () => {
        const services = readServices();
        const nextServices = [makeService(payload), ...services];
        return saveServices(nextServices);
      },
    );
  },

  async updateService(
    id: string,
    payload: ServicePayload,
    language = "en",
  ): Promise<Service[]> {
    await delay();
    return tryLiferayObjectApi(
      () => liferayObjectApi.updateService(id, payload),
      () => {
        const services = readServices();
        const nextServices = services.map((service) => {
          if (service.id !== id) return service;
          const processingTime = Number(payload.processingTime);
          const fee = Number(payload.fee);
          const isArabic = language.startsWith("ar");

          return {
            ...service,
            ...payload,
            title: isArabic ? service.title : payload.title,
            description: isArabic ? service.description : payload.description,
            translations: isArabic
              ? {
                  ...service.translations,
                  ar: {
                    ...service.translations?.ar,
                    title: payload.title,
                    description: payload.description,
                  },
                }
              : service.translations,
            processingTime,
            processingTimeLabel: `${processingTime} minutes`,
            fee,
            feeLabel: fee === 0 ? "Free" : String(fee),
          };
        });
        return saveServices(nextServices);
      },
    );
  },

  async deleteService(id: string): Promise<Service[]> {
    await delay();
    return tryLiferayObjectApi(
      () => liferayObjectApi.deleteService(id),
      () => {
        const nextServices = readServices().filter((service) => service.id !== id);
        return saveServices(nextServices);
      },
    );
  },

  async toggleFavorite(id: string): Promise<Service[]> {
    await delay(180);
    return tryLiferayObjectApi(
      () => liferayObjectApi.toggleFavorite(id),
      () => {
        const nextServices = readServices().map((service) =>
          service.id === id
            ? { ...service, isFavorite: !service.isFavorite }
            : service,
        );
        return saveServices(nextServices);
      },
    );
  },

  async resetServices(): Promise<Service[]> {
    await delay();
    return tryLiferayObjectApi(
      () => liferayObjectApi.resetServices(initialServices),
      () => {
        localStorage.removeItem(servicesKey);
        localStorage.setItem(servicesKey, JSON.stringify(initialServices));
        return clone(initialServices);
      },
    );
  },
};
