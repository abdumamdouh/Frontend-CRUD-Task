import { useTranslation } from "react-i18next";
import { useQuery } from "../../../hooks/useQuery";
import { servicesApi } from "../services";
import type { Service } from "../types";
import { useServiceActions } from "./useServiceActions";
import { useServiceDirectoryState } from "./useServiceDirectoryState";
import { useServiceList } from "./useServiceList";

export function useServicesDirectory() {
  const { t, i18n } = useTranslation();

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

  const directoryState = useServiceDirectoryState();

  const serviceList = useServiceList({
    currentPage: directoryState.currentPage,
    filters: directoryState.filters,
    language: i18n.language,
    searchTerm: directoryState.debouncedSearchTerm,
    services,
    sortOption: directoryState.sortOption,
  });

  const serviceActions = useServiceActions({
    language: i18n.language,
    resetFilters: directoryState.resetFilters,
    services,
    setData,
    t,
  });

  return {
    error,
    i18n,
    isLoading,
    refetch,
    services,
    t,
    ...directoryState,
    ...serviceList,
    ...serviceActions,
  };
}
