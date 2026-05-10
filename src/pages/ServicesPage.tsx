import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { servicesApi } from "../api/servicesApi";
import { ConfirmDialog } from "../components/common/ConfirmDialog";
import { EmptyState } from "../components/common/EmptyState";
import { ErrorState } from "../components/common/ErrorState";
import { AppModal } from "../components/common/design-system";
import { Pagination } from "../components/common/Pagination";
import { SkeletonCard } from "../components/common/SkeletonCard";
import { useToast } from "../components/common/toastContext";
import { ServiceForm } from "../components/services/ServiceForm";
import { ServiceGrid } from "../components/services/ServiceGrid";
import { ServicesToolbar } from "../components/services/ServicesToolbar";
import { appTheme, categories, statuses, tags } from "../config/theme";
import { useDebounce } from "../hooks/useDebounce";
import { useQuery } from "../hooks/useQuery";
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

const sortOptions: SortOption[] = [
  "newest",
  "oldest",
  "title-az",
  "title-za",
  "processing-time",
  "fee-low",
  "fee-high",
];

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
  return sort && sortOptions.includes(sort) ? sort : "newest";
};

const getInitialPage = (searchParams: URLSearchParams) => {
  const page = Number(searchParams.get("page"));
  return Number.isFinite(page) && page > 0 ? page : 1;
};

export function ServicesPage() {
  const { t, i18n } = useTranslation();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

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
    () => searchParams.get("q") ?? "",
  );
  const debouncedSearchTerm = useDebounce(searchTerm, appTheme.debounceDelay);
  const [filters, setFilters] = useState<ToolbarFilters>(() =>
    getInitialFilters(searchParams),
  );
  const [sortOption, setSortOption] = useState<SortOption>(() =>
    getInitialSort(searchParams),
  );
  const [currentPage, setCurrentPage] = useState(() =>
    getInitialPage(searchParams),
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleFiltersChange = useCallback((patch: Partial<ToolbarFilters>) => {
    setFilters((current) => ({ ...current, ...patch }));
  }, []);

  const resetFilters = useCallback(() => {
    setSearchTerm("");
    setFilters(defaultFilters);
    setSortOption("newest");
    setCurrentPage(1);
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
      const localizedService = getLocalizedService(service, i18n.language);
      showToast(t("feedback.started", { title: localizedService.title }));
    },
    [i18n.language, showToast, t],
  );

  const handleTagFilter = useCallback((tag: ServiceTag) => {
    setFilters((current) => ({
      ...current,
      tags: current.tags.includes(tag) ? current.tags : [...current.tags, tag],
    }));
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSubmit = useCallback(
    async (payload: ServicePayload) => {
      setIsSaving(true);
      try {
        const isEditing = Boolean(editingService);
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
        showToast(t(isEditing ? "feedback.updated" : "feedback.created"));
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
        const nextServices = await servicesApi.toggleFavorite(id);
        setData(nextServices);
        showToast(
          t(
            wasFavorite ? "feedback.favoriteRemoved" : "feedback.favoriteAdded",
          ),
        );
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

  return (
    <section className="motion-page">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-aeblack-800">
          {t("allServices")}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {t("showingResults", {
            shown: pageServices.length,
            total: sortedServices.length,
          })}
        </p>
      </div>

      <ServicesToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        sortOption={sortOption}
        onSortChange={setSortOption}
        onResetFilters={resetFilters}
        onAddService={openCreateForm}
        onResetData={handleResetData}
        isResetting={isResetting}
        totalCount={services.length}
        resultCount={sortedServices.length}
      />

      {isLoading ? (
        <div>
          <p className="mb-4 text-sm font-semibold text-slate-700">
            {t("loadingServices")}
          </p>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </div>
      ) : error ? (
        <ErrorState onRetry={refetch} />
      ) : pageServices.length === 0 ? (
        <EmptyState
          title={t("noServicesFound")}
          message={t("noServicesHelp")}
        />
      ) : (
        <>
          <ServiceGrid
            services={pageServices}
            onToggleFavorite={handleToggleFavorite}
            onStart={handleStartService}
            onEdit={openEditForm}
            onDelete={openDeleteDialog}
            onTagClick={handleTagFilter}
            favoriteBusyId={favoriteBusyId}
            deletingId={deletingId}
          />
          <Pagination
            currentPage={currentPage}
            pageCount={pageCount}
            onPageChange={changePage}
          />
        </>
      )}

      <AppModal
        isOpen={isFormOpen}
        title={editingService ? t("editService") : t("addService")}
        onClose={closeForm}
      >
        <ServiceForm
          key={`${editingService?.id ?? "new"}-${i18n.language}`}
          service={editingService}
          onSubmit={handleSubmit}
          onCancel={closeForm}
          isSaving={isSaving}
        />
      </AppModal>
      <ConfirmDialog
        isOpen={Boolean(servicePendingDelete)}
        title={t("deleteServiceTitle")}
        message={t("deleteServiceMessage", {
          title: servicePendingDelete?.title,
        })}
        confirmLabel={t("delete")}
        isConfirming={Boolean(deletingId)}
        onCancel={() => setServicePendingDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </section>
  );
}
