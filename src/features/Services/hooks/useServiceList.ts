import { useMemo } from "react";
import { appTheme } from "../../../config/theme";
import type { Service, SortOption } from "../types";
import { filterServices } from "../utils/filterServices";
import { getPageCount, paginate } from "../utils/paginate";
import { sortServices } from "../utils/sortServices";
import type { ToolbarFilters } from "./useServiceDirectoryState";

interface UseServiceListOptions {
  currentPage: number;
  filters: ToolbarFilters;
  language: string;
  searchTerm: string;
  services: Service[];
  sortOption: SortOption;
}

export function useServiceList({
  currentPage,
  filters,
  language,
  searchTerm,
  services,
  sortOption,
}: UseServiceListOptions) {
  const filteredServices = useMemo(
    () => filterServices(services, { searchTerm, ...filters }, language),
    [filters, language, searchTerm, services],
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

  return {
    pageCount,
    pageServices,
    sortedServices,
  };
}
