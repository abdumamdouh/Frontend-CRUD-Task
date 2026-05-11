import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { appTheme } from "../../../config/theme";
import { useToast } from "../../../components/common/toastContext";
import { useDebounce } from "../../../hooks/useDebounce";
import { useQuery } from "../../../hooks/useQuery";
import {
  categories,
  serviceSortOptions,
  statuses,
  tags,
} from "../constants/serviceOptions";
import { servicesApi } from "../services/services.service";
import type {
  Service,
  ServiceCategory,
  ServiceFilters,
  ServicePayload,
  ServiceTag,
  SortOption,
} from "../types/service";
import { filterServices } from "../utils/filterServices";
import { getPageCount, paginate } from "../utils/paginate";
import { getLocalizedService } from "../utils/serviceTranslations";
import { sortServices } from "../utils/sortServices";

type ToolbarFilters = Omit<ServiceFilters, "searchTerm">;

const defaultFilters: ToolbarFilters = {
  category: "",
  statuses: [],
  tags: [],
  popularOnly: false,
};

interface DirectoryQueryState {
  searchTerm: string;
  filters: ToolbarFilters;
  sortOption: SortOption;
  currentPage: number;
}

export function useServicesDirectory() {
  const { t, i18n } = useTranslation();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [initialDirectoryState] = useState(() =>
    getInitialDirectoryState(searchParams),
  );

  const {
    data: services,
    isLoading,
    error,
    refetch,
    setData,
  } = useQuery<Service[]>({
    queryFn: servicesApi.getServices,
    initialData: [],
  });

  const [searchTerm, setSearchTerm] = useState(
    () => initialDirectoryState.searchTerm,
  );

  const debouncedSearchTerm = useDebounce(searchTerm, appTheme.debounceDelay);

  const [filters, setFilters] = useState<ToolbarFilters>(
    () => initialDirectoryState.filters,
  );

  const [sortOption, setSortOption] = useState<SortOption>(
    () => initialDirectoryState.sortOption,
  );

  const [currentPage, setCurrentPage] = useState(
    () => initialDirectoryState.currentPage,
  );

  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [favoriteBusyId, setFavoriteBusyId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [servicePendingDelete, setServicePendingDelete] =
    useState<Service | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  const didMountRef = useRef(false);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    setCurrentPage(1);
  }, [debouncedSearchTerm, filters, sortOption]);

  useEffect(() => {
    const nextParams = new URLSearchParams();
    if (searchTerm.trim()) nextParams.set("q", searchTerm.trim());
    if (filters.category) nextParams.set("category", filters.category);
    if (filters.statuses.length)
      nextParams.set("status", filters.statuses.join(","));
    if (filters.tags.length) nextParams.set("tags", filters.tags.join(","));
    if (filters.popularOnly) nextParams.set("popular", "true");
    if (sortOption !== "newest") nextParams.set("sort", sortOption);
    if (currentPage > 1) nextParams.set("page", String(currentPage));
    setSearchParams(nextParams, { replace: true });
    saveDirectoryState({
      searchTerm,
      filters,
      sortOption,
      currentPage,
    });
  }, [currentPage, filters, searchTerm, setSearchParams, sortOption]);

  const filteredServices = useMemo(
    () =>
      filterServices(
        services,
        { searchTerm: debouncedSearchTerm, ...filters },
        i18n.language,
      ),
    [debouncedSearchTerm, filters, i18n.language, services],
  );

  const sortedServices = useMemo(
    () => sortServices(filteredServices, sortOption),
    [filteredServices, sortOption],
  );

  const pageCount = getPageCount(sortedServices.length, appTheme.pageSize);

  const pageServices = useMemo(
    () => paginate(sortedServices, currentPage, appTheme.pageSize),
    [currentPage, sortedServices],
  );

  const changePage = useCallback((page: number) => {
    setCurrentPage(page);
    scrollToTop();
  }, []);

  const handleFiltersChange = useCallback((patch: Partial<ToolbarFilters>) => {
    setFilters((current) => ({ ...current, ...patch }));
  }, []);

  const resetFilters = useCallback(() => {
    setSearchTerm("");
    setFilters(defaultFilters);
    setSortOption("newest");
    setCurrentPage(1);
    localStorage.removeItem(appTheme.storageKeys.serviceDirectoryState);
  }, []);

  const openCreateForm = useCallback(() => {
    setEditingService(null);
    setIsFormOpen(true);
  }, []);

  const openEditForm = useCallback((service: Service) => {
    setEditingService(service);
    setIsFormOpen(true);
  }, []);

  const closeForm = useCallback(() => {
    setIsFormOpen(false);
  }, []);

  const handleStartService = useCallback(
    (service: Service) => {
      const serviceTitle = getLocalizedService(service, i18n.language).title;
      showToast(t("feedback.started", { title: serviceTitle }));
    },
    [i18n.language, showToast, t],
  );

  const handleTagFilter = useCallback((tag: ServiceTag) => {
    setFilters((current) => ({
      ...current,
      tags: current.tags.includes(tag) ? current.tags : [...current.tags, tag],
    }));
    setCurrentPage(1);
    scrollToTop();
  }, []);

  const handleSubmit = useCallback(
    async (payload: ServicePayload) => {
      setIsSaving(true);
      try {
        const isEditing = Boolean(editingService);
        const feedbackKey = isEditing ? "feedback.updated" : "feedback.created";
        const nextServices = editingService
          ? await servicesApi.updateService(
              editingService.id,
              payload,
              i18n.language,
            )
          : await servicesApi.createService(payload);
        setData(nextServices);
        setIsFormOpen(false);
        setEditingService(null);
        showToast(t(feedbackKey));
      } catch {
        showToast(t("feedback.failed"), "error");
      } finally {
        setIsSaving(false);
      }
    },
    [editingService, i18n.language, setData, showToast, t],
  );

  const handleToggleFavorite = useCallback(
    async (id: string) => {
      setFavoriteBusyId(id);
      try {
        const wasFavorite = services.find(
          (service) => service.id === id,
        )?.isFavorite;
        const feedbackKey = wasFavorite
          ? "feedback.favoriteRemoved"
          : "feedback.favoriteAdded";
        const nextServices = await servicesApi.toggleFavorite(id);
        setData(nextServices);
        showToast(t(feedbackKey));
      } catch {
        showToast(t("feedback.failed"), "error");
      } finally {
        setFavoriteBusyId(null);
      }
    },
    [services, setData, showToast, t],
  );

  const openDeleteDialog = useCallback((service: Service) => {
    setServicePendingDelete(service);
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setServicePendingDelete(null);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!servicePendingDelete) return;
    setDeletingId(servicePendingDelete.id);
    try {
      const nextServices = await servicesApi.deleteService(
        servicePendingDelete.id,
      );
      setData(nextServices);
      setServicePendingDelete(null);
      showToast(t("feedback.deleted"));
    } catch {
      showToast(t("feedback.failed"), "error");
    } finally {
      setDeletingId(null);
    }
  }, [servicePendingDelete, setData, showToast, t]);

  const handleResetData = useCallback(async () => {
    setIsResetting(true);
    try {
      const nextServices = await servicesApi.resetServices();
      setData(nextServices);
      resetFilters();
      showToast(t("feedback.reset"));
    } catch {
      showToast(t("feedback.failed"), "error");
    } finally {
      setIsResetting(false);
    }
  }, [resetFilters, setData, showToast, t]);

  return {
    currentPage,
    deletingId,
    editingService,
    error,
    favoriteBusyId,
    filters,
    handleConfirmDelete,
    handleFiltersChange,
    handleResetData,
    handleStartService,
    handleSubmit,
    handleTagFilter,
    handleToggleFavorite,
    i18n,
    isFormOpen,
    isLoading,
    isResetting,
    isSaving,
    openCreateForm,
    openDeleteDialog,
    openEditForm,
    pageCount,
    pageServices,
    refetch,
    resetFilters,
    searchTerm,
    servicePendingDelete,
    services,
    setSearchTerm,
    setSortOption,
    sortedServices,
    sortOption,
    t,
    changePage,
    closeDeleteDialog,
    closeForm,
  };
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const hasDirectoryParams = (searchParams: URLSearchParams) =>
  ["q", "category", "status", "tags", "popular", "sort", "page"].some((key) =>
    searchParams.has(key),
  );

const parseListParam = <TItem extends string>(
  value: string | null,
  allowed: TItem[],
) =>
  (value
    ?.split(",")
    .filter((item): item is TItem => allowed.includes(item as TItem)) ??
    []) as TItem[];

const getInitialFilters = (searchParams: URLSearchParams): ToolbarFilters => ({
  category: categories.includes(searchParams.get("category") as ServiceCategory)
    ? (searchParams.get("category") as ServiceCategory)
    : "",
  statuses: parseListParam(searchParams.get("status"), statuses),
  tags: parseListParam(searchParams.get("tags"), tags),
  popularOnly: searchParams.get("popular") === "true",
});

const getInitialSort = (searchParams: URLSearchParams): SortOption => {
  const sort = searchParams.get("sort") as SortOption | null;
  return sort && serviceSortOptions.includes(sort) ? sort : "newest";
};

const getInitialPage = (searchParams: URLSearchParams) => {
  const page = Number(searchParams.get("page"));
  return Number.isFinite(page) && page > 0 ? page : 1;
};

const getDirectoryStateFromParams = (
  searchParams: URLSearchParams,
): DirectoryQueryState => ({
  searchTerm: searchParams.get("q") ?? "",
  filters: getInitialFilters(searchParams),
  sortOption: getInitialSort(searchParams),
  currentPage: getInitialPage(searchParams),
});

const getSavedDirectoryState = (): DirectoryQueryState | null => {
  try {
    const value = localStorage.getItem(
      appTheme.storageKeys.serviceDirectoryState,
    );
    if (!value) return null;

    const parsed = JSON.parse(value) as Partial<DirectoryQueryState>;
    const params = new URLSearchParams();

    if (typeof parsed.searchTerm === "string") {
      params.set("q", parsed.searchTerm);
    }

    if (parsed.filters?.category) {
      params.set("category", parsed.filters.category);
    }

    if (parsed.filters?.statuses?.length) {
      params.set("status", parsed.filters.statuses.join(","));
    }

    if (parsed.filters?.tags?.length) {
      params.set("tags", parsed.filters.tags.join(","));
    }

    if (parsed.filters?.popularOnly) {
      params.set("popular", "true");
    }

    if (parsed.sortOption) {
      params.set("sort", parsed.sortOption);
    }

    if (parsed.currentPage) {
      params.set("page", String(parsed.currentPage));
    }

    return getDirectoryStateFromParams(params);
  } catch {
    localStorage.removeItem(appTheme.storageKeys.serviceDirectoryState);
    return null;
  }
};

const getInitialDirectoryState = (
  searchParams: URLSearchParams,
): DirectoryQueryState => {
  if (hasDirectoryParams(searchParams)) {
    return getDirectoryStateFromParams(searchParams);
  }

  return getSavedDirectoryState() ?? getDirectoryStateFromParams(searchParams);
};

const saveDirectoryState = (state: DirectoryQueryState) => {
  localStorage.setItem(
    appTheme.storageKeys.serviceDirectoryState,
    JSON.stringify(state),
  );
};
