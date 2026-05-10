import { appTheme } from "../config/theme";
import { initialServices } from "../data/initialServices";
import type { Service, ServicePayload } from "../types/service";

const { services: servicesKey } = appTheme.storageKeys;

const delay = (ms = appTheme.apiDelay) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const readServices = (): Service[] => {
  const saved = localStorage.getItem(servicesKey);
  if (!saved) {
    localStorage.setItem(servicesKey, JSON.stringify(initialServices));
    return clone(initialServices);
  }

  try {
    return JSON.parse(saved) as Service[];
  } catch {
    localStorage.setItem(servicesKey, JSON.stringify(initialServices));
    return clone(initialServices);
  }
};

const saveServices = (services: Service[]): Service[] => {
  localStorage.setItem(servicesKey, JSON.stringify(services));
  return clone(services);
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
    feeLabel: fee === 0 ? "Free" : `AED ${fee}`,
    isFavorite: false,
    createdAt: new Date().toISOString(),
  };
};

export const servicesApi = {
  async getServices(): Promise<Service[]> {
    await delay();
    return readServices();
  },

  async createService(payload: ServicePayload): Promise<Service[]> {
    await delay();
    const services = readServices();
    const nextServices = [makeService(payload), ...services];
    return saveServices(nextServices);
  },

  async updateService(
    id: string,
    payload: ServicePayload,
    language = "en",
  ): Promise<Service[]> {
    await delay();
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
        feeLabel: fee === 0 ? "Free" : `AED ${fee}`,
      };
    });
    return saveServices(nextServices);
  },

  async deleteService(id: string): Promise<Service[]> {
    await delay();
    const nextServices = readServices().filter((service) => service.id !== id);
    return saveServices(nextServices);
  },

  async toggleFavorite(id: string): Promise<Service[]> {
    await delay(180);
    const nextServices = readServices().map((service) =>
      service.id === id
        ? { ...service, isFavorite: !service.isFavorite }
        : service,
    );
    return saveServices(nextServices);
  },

  async resetServices(): Promise<Service[]> {
    await delay();
    localStorage.removeItem(servicesKey);
    localStorage.setItem(servicesKey, JSON.stringify(initialServices));
    return clone(initialServices);
  },
};
