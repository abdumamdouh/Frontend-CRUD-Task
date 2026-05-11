import { memo, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { SlidersHorizontal } from "@phosphor-icons/react";
import type { ServiceFilters, SortOption } from "../types/service";
import {
  translateCategory,
  translateStatus,
  translateTag,
} from "../utils/serviceTranslations";
import {
  AppButton,
  AppInput,
  AppModal,
} from "../../../components/common/design-system";
import { ServicesFilters } from "./ServicesFilters";
import { SortSelect } from "./SortSelect";

interface ServicesToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters: Omit<ServiceFilters, "searchTerm">;
  onFiltersChange: (patch: Partial<Omit<ServiceFilters, "searchTerm">>) => void;
  sortOption: SortOption;
  onSortChange: (value: SortOption) => void;
  onResetFilters: () => void;
  onAddService: () => void;
  onResetData: () => void;
  isResetting: boolean;
  totalCount: number;
  resultCount: number;
}

type ToolbarFilters = Omit<ServiceFilters, "searchTerm">;

const cloneFilters = (filters: ToolbarFilters): ToolbarFilters => ({
  category: filters.category,
  statuses: [...filters.statuses],
  tags: [...filters.tags],
  popularOnly: filters.popularOnly,
});

function ServicesToolbarComponent({
  searchTerm,
  onSearchChange,
  filters,
  onFiltersChange,
  sortOption,
  onSortChange,
  onResetFilters,
  onAddService,
  onResetData,
  isResetting,
  totalCount,
  resultCount,
}: ServicesToolbarProps) {
  const { t, i18n } = useTranslation();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState<ToolbarFilters>(() =>
    cloneFilters(filters),
  );
  const activeFilters = useMemo(() => {
    const items: Array<{ key: string; label: string }> = [];
    if (filters.category) {
      items.push({
        key: "category",
        label: `${t("category")}: ${translateCategory(filters.category, i18n.language)}`,
      });
    }
    filters.statuses.forEach((status) =>
      items.push({
        key: `status-${status}`,
        label: `${t("status")}: ${translateStatus(status, i18n.language)}`,
      }),
    );
    filters.tags.forEach((tag) =>
      items.push({
        key: `tag-${tag}`,
        label: `${t("tags")}: ${translateTag(tag, i18n.language)}`,
      }),
    );
    if (filters.popularOnly) {
      items.push({ key: "popular", label: t("popularOnly") });
    }
    return items;
  }, [filters, i18n.language, t]);
  const hasActiveFilters = activeFilters.length > 0;
  const activeFilterCount =
    (filters.category ? 1 : 0) +
    filters.statuses.length +
    filters.tags.length +
    (filters.popularOnly ? 1 : 0);

  const openFilters = () => {
    setDraftFilters(cloneFilters(filters));
    setIsFiltersOpen(true);
  };

  const applyFilters = () => {
    onFiltersChange(draftFilters);
    setIsFiltersOpen(false);
  };

  const resetDraftFilters = () => {
    const emptyFilters: ToolbarFilters = {
      category: "",
      statuses: [],
      tags: [],
      popularOnly: false,
    };
    setDraftFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const updateDraftFilters = (patch: Partial<ToolbarFilters>) => {
    setDraftFilters((current) => ({ ...current, ...patch }));
  };

  return (
    <section className="services-toolbar mb-8 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
        <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(260px,0.8fr)_240px] [&_.app-select]:h-[58px] [&_.app-select]:py-4">
          <AppInput
            type="search"
            label={t("search")}
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={t("searchPlaceholder")}
          />
          <SortSelect value={sortOption} onChange={onSortChange} />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[340px] [&_button]:h-[58px]">
          <AppButton className="min-w-36" onClick={onAddService}>
            {t("addService")}
          </AppButton>
          <AppButton
            variant="secondary"
            className="min-w-36"
            onClick={onResetData}
            disabled={isResetting}
          >
            {isResetting ? t("resetting") : t("resetData")}
          </AppButton>
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-slate-200 bg-whitely-50 p-4">
        <div className="grid gap-4 xl:grid-cols-[auto_1fr_auto] xl:items-center">
          <div className="grid grid-cols-3 gap-2 rounded-md bg-white p-3 shadow-sm">
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                {t("filters")}
              </span>
              <strong className="text-lg text-secondary-900">
                {activeFilterCount}
              </strong>
            </div>
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                {t("results")}
              </span>
              <strong className="text-lg text-secondary-900">
                {resultCount}
              </strong>
            </div>
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                {t("total")}
              </span>
              <strong className="text-lg text-secondary-900">
                {totalCount}
              </strong>
            </div>
          </div>

          <div className="grid min-w-0 gap-2">
            <p className="text-sm text-slate-600">
              {t("filterSummary", {
                count: activeFilterCount,
                results: resultCount,
                total: totalCount,
              })}
            </p>
            <div className="flex flex-wrap gap-2">
              {hasActiveFilters ? (
                activeFilters.slice(0, 5).map((filter) => (
                  <span
                    key={filter.key}
                    className="aegov-badge badge-base border-secondary-100 bg-secondary-50 text-secondary-800"
                  >
                    {filter.label}
                  </span>
                ))
              ) : (
                <span className="text-sm text-slate-500">
                  {t("noActiveFilters")}
                </span>
              )}
              {activeFilters.length > 5 ? (
                <span className="aegov-badge badge-base border-primary-100 bg-primary-50 text-primary-800">
                  {t("moreTags", { count: activeFilters.length - 5 })}
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 xl:justify-end">
            <AppButton variant="secondary" onClick={openFilters}>
              <span className="inline-flex items-center gap-2">
                <SlidersHorizontal aria-hidden="true" className="h-5 w-5" />
                {t("filters")}
              </span>
            </AppButton>
            <AppButton variant="secondary" onClick={onResetFilters}>
              {t("resetFilters")}
            </AppButton>
          </div>
        </div>
      </div>

      <AppModal
        isOpen={isFiltersOpen}
        title={t("filters")}
        onClose={() => setIsFiltersOpen(false)}
        maxWidthClassName="max-w-3xl"
      >
        <ServicesFilters filters={draftFilters} onChange={updateDraftFilters} />
        <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-4">
          <AppButton variant="secondary" onClick={resetDraftFilters}>
            {t("resetFilters")}
          </AppButton>
          <AppButton onClick={applyFilters}>{t("done")}</AppButton>
        </div>
      </AppModal>
    </section>
  );
}

export const ServicesToolbar = memo(ServicesToolbarComponent);
