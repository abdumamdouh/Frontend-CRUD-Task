import { appTheme } from "../../../config/theme";
import type {
  Service,
  ServiceCategory,
  ServicePayload,
  ServiceStatus,
  ServiceTag,
} from "../types/service";

const OBJECT_API_PATH = "/o/c/uaeservices";
const PAGE_SIZE = 200;

const { favoriteServiceIds: favoriteServiceIdsKey } = appTheme.storageKeys;

type LiferayListTypeValue = {
  key?: string;
  name?: string;
};

type LiferayObjectEntry = {
  actions?: Record<string, unknown>;
  category?: LiferayListTypeValue | string;
  dateCreated?: string;
  description?: string;
  externalReferenceCode?: string;
  fee?: number;
  id: number | string;
  isPopular?: boolean;
  processingTime?: number;
  serviceStatus?: LiferayListTypeValue | string;
  serviceTags?: Array<LiferayListTypeValue | string>;
  title?: string;
};

type LiferayPage<T> = {
  actions?: Record<string, unknown>;
  items?: T[];
  totalCount?: number;
};

type ObjectEntryPayload = {
  category: { key: string };
  description: string;
  externalReferenceCode?: string;
  fee: number;
  isPopular: boolean;
  processingTime: number;
  serviceStatus: { key: string };
  serviceTags: Array<{ key: string }>;
  title: string;
};

const categoryKeys: Record<ServiceCategory, string> = {
  Business: "business",
  Education: "education",
  Employment: "employment",
  Family: "family",
  Healthcare: "healthcare",
  Housing: "housing",
  Identity: "identity",
  Tourism: "tourism",
  Transport: "transport",
  Utilities: "utilities",
};

const statusKeys: Record<ServiceStatus, string> = {
  Available: "available",
  Limited: "limited",
  Maintenance: "maintenance",
};

const tagKeys: Record<ServiceTag, string> = {
  Application: "application",
  Appointment: "appointment",
  Business: "business",
  Certificate: "certificate",
  Free: "free",
  Individuals: "individuals",
  Online: "online",
  "Payment Required": "paymentRequired",
  Popular: "popular",
  Renewal: "renewal",
  Vehicles: "vehicles",
};

const keyToCategory = new Map(
  Object.entries(categoryKeys).map(([label, key]) => [
    key,
    label as ServiceCategory,
  ]),
);

const keyToStatus = new Map(
  Object.entries(statusKeys).map(([label, key]) => [
    key,
    label as ServiceStatus,
  ]),
);

const keyToTag = new Map(
  Object.entries(tagKeys).map(([label, key]) => [key, label as ServiceTag]),
);

const getListTypeKey = (value: LiferayListTypeValue | string | undefined) => {
  if (!value) return "";
  return typeof value === "string" ? value : value.key ?? value.name ?? "";
};

const readFavoriteIds = () => {
  try {
    return new Set<string>(
      JSON.parse(localStorage.getItem(favoriteServiceIdsKey) ?? "[]") as string[],
    );
  } catch {
    localStorage.removeItem(favoriteServiceIdsKey);
    return new Set<string>();
  }
};

const writeFavoriteIds = (favoriteIds: Set<string>) => {
  localStorage.setItem(favoriteServiceIdsKey, JSON.stringify([...favoriteIds]));
};

const isLiferayRuntime = () =>
  typeof window !== "undefined" &&
  Boolean(window.Liferay?.Util?.fetch || window.Liferay?.ThemeDisplay);

const liferayFetch = async (
  path: string,
  init: Parameters<typeof globalThis.fetch>[1] = {},
) => {
  if (!isLiferayRuntime()) {
    throw new Error("Liferay runtime is not available.");
  }

  const fetcher = window.Liferay?.Util?.fetch ?? window.fetch.bind(window);
  const headers = new Headers(init.headers);

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (window.Liferay?.authToken && !headers.has("x-csrf-token")) {
    headers.set("x-csrf-token", window.Liferay.authToken);
  }

  const response = await fetcher(path, {
    credentials: "same-origin",
    ...init,
    headers,
  });

  if (!response.ok) {
    throw new Error(`Liferay request failed with ${response.status}`);
  }

  if (response.status === 204) {
    return undefined;
  }

  return response.json() as Promise<unknown>;
};

const toService = (entry: LiferayObjectEntry): Service => {
  const id = String(entry.id);
  const favoriteIds = readFavoriteIds();
  const processingTime = Number(entry.processingTime ?? 0);
  const fee = Number(entry.fee ?? 0);
  const categoryKey = getListTypeKey(entry.category);
  const statusKey = getListTypeKey(entry.serviceStatus);

  return {
    id,
    category: keyToCategory.get(categoryKey) ?? "Business",
    createdAt: entry.dateCreated ?? new Date().toISOString(),
    description: entry.description ?? "",
    fee,
    feeLabel: fee === 0 ? "Free" : String(fee),
    isFavorite:
      favoriteIds.has(id) ||
      Boolean(
        entry.externalReferenceCode &&
          favoriteIds.has(entry.externalReferenceCode),
      ),
    isPopular: Boolean(entry.isPopular),
    processingTime,
    processingTimeLabel: `${processingTime} minutes`,
    status: keyToStatus.get(statusKey) ?? "Available",
    tags:
      entry.serviceTags
        ?.map((tag) => keyToTag.get(getListTypeKey(tag)))
        .filter((tag): tag is ServiceTag => Boolean(tag)) ?? [],
    title: entry.title ?? "",
  };
};

const toObjectEntryPayload = (
  payload: ServicePayload,
  externalReferenceCode?: string,
): ObjectEntryPayload => {
  const processingTime = Number(payload.processingTime);
  const fee = Number(payload.fee);

  return {
    ...(externalReferenceCode ? { externalReferenceCode } : {}),
    category: { key: categoryKeys[payload.category] },
    description: payload.description,
    fee,
    isPopular: payload.isPopular,
    processingTime,
    serviceStatus: { key: statusKeys[payload.status] },
    serviceTags: payload.tags.map((tag) => ({ key: tagKeys[tag] })),
    title: payload.title,
  };
};

export const liferayObjectApi = {
  async createService(payload: ServicePayload) {
    await liferayFetch(OBJECT_API_PATH, {
      body: JSON.stringify(toObjectEntryPayload(payload)),
      method: "POST",
    });

    return this.getServices();
  },

  async deleteService(id: string) {
    await liferayFetch(`${OBJECT_API_PATH}/${id}`, {
      method: "DELETE",
    });

    return this.getServices();
  },

  async getServices() {
    const page = (await liferayFetch(
      `${OBJECT_API_PATH}?page=1&pageSize=${PAGE_SIZE}&sort=dateCreated:desc`,
    )) as LiferayPage<LiferayObjectEntry>;

    const services = page.items?.map(toService) ?? [];
    const canCreate = Boolean(page.actions?.create);

    if (!canCreate && services.length === 0) {
      throw new Error("Liferay Object API is readable but not usable for CRUD.");
    }

    return services;
  },

  async resetServices(initialServices: Service[]) {
    const page = (await liferayFetch(
      `${OBJECT_API_PATH}?page=1&pageSize=${PAGE_SIZE}`,
    )) as LiferayPage<LiferayObjectEntry>;

    await Promise.all(
      page.items?.map((entry) =>
        liferayFetch(`${OBJECT_API_PATH}/${entry.id}`, { method: "DELETE" }),
      ) ?? [],
    );

    for (const service of initialServices) {
      await liferayFetch(OBJECT_API_PATH, {
        body: JSON.stringify(toObjectEntryPayload(service, service.id)),
        method: "POST",
      });
    }

    return this.getServices();
  },

  async toggleFavorite(id: string) {
    const favoriteIds = readFavoriteIds();

    if (favoriteIds.has(id)) {
      favoriteIds.delete(id);
    } else {
      favoriteIds.add(id);
    }

    writeFavoriteIds(favoriteIds);

    return this.getServices();
  },

  async updateService(id: string, payload: ServicePayload) {
    await liferayFetch(`${OBJECT_API_PATH}/${id}`, {
      body: JSON.stringify(toObjectEntryPayload(payload)),
      method: "PATCH",
    });

    return this.getServices();
  },
};
