import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { appTheme } from "../../../config/theme";
import { useDebounce } from "../../../hooks/useDebounce";
import {
  categories,
  serviceSortOptions,
  statuses,
  tags,
} from "../constants/serviceOptions";
import type {
  ServiceCategory,
  ServiceFilters,
  ServiceTag,
  SortOption,
} from "../types";

export type ToolbarFilters = Omit<ServiceFilters, "searchTerm">;

export const defaultFilters: ToolbarFilters = {
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

export function useServiceDirectoryState() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [initialDirectoryState] = useState(() =>
    getInitialDirectoryState(searchParams),
  );

  const didMountRef = useRef(false);

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

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    setCurrentPage(1);
  }, [debouncedSearchTerm, filters, sortOption]);

  useEffect(() => {
    const nextParams = getSearchParamsFromState({
      searchTerm,
      filters,
      sortOption,
      currentPage,
    });

    setSearchParams(nextParams, { replace: true });

    saveDirectoryState({
      searchTerm,
      filters,
      sortOption,
      currentPage,
    });
  }, [currentPage, filters, searchTerm, setSearchParams, sortOption]);

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

  const handleTagFilter = useCallback((tag: ServiceTag) => {
    setFilters((current) => ({
      ...current,
      tags: current.tags.includes(tag) ? current.tags : [...current.tags, tag],
    }));
    setCurrentPage(1);
    scrollToTop();
  }, []);

  const changePage = useCallback((page: number) => {
    setCurrentPage(page);
    scrollToTop();
  }, []);

  return {
    changePage,
    currentPage,
    debouncedSearchTerm,
    filters,
    handleFiltersChange,
    handleTagFilter,
    resetFilters,
    searchTerm,
    setSearchTerm,
    setSortOption,
    sortOption,
  };
}

export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const getSearchParamsFromState = ({
  searchTerm,
  filters,
  sortOption,
  currentPage,
}: DirectoryQueryState) => {
  const nextParams = new URLSearchParams();
  if (searchTerm.trim()) nextParams.set("q", searchTerm.trim());
  if (filters.category) nextParams.set("category", filters.category);
  if (filters.statuses.length)
    nextParams.set("status", filters.statuses.join(","));
  if (filters.tags.length) nextParams.set("tags", filters.tags.join(","));
  if (filters.popularOnly) nextParams.set("popular", "true");
  if (sortOption !== "newest") nextParams.set("sort", sortOption);
  if (currentPage > 1) nextParams.set("page", String(currentPage));

  return nextParams;
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
    return getDirectoryStateFromParams(getSearchParamsFromSavedState(parsed));
  } catch {
    localStorage.removeItem(appTheme.storageKeys.serviceDirectoryState);
    return null;
  }
};

const getSearchParamsFromSavedState = (state: Partial<DirectoryQueryState>) => {
  const params = new URLSearchParams();

  if (typeof state.searchTerm === "string") params.set("q", state.searchTerm);
  if (state.filters?.category) params.set("category", state.filters.category);
  if (state.filters?.statuses?.length) {
    params.set("status", state.filters.statuses.join(","));
  }
  if (state.filters?.tags?.length) {
    params.set("tags", state.filters.tags.join(","));
  }
  if (state.filters?.popularOnly) params.set("popular", "true");
  if (state.sortOption) params.set("sort", state.sortOption);
  if (state.currentPage) params.set("page", String(state.currentPage));

  return params;
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
