import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../../components/common/toastContext";
import { useQuery } from "../../../hooks/useQuery";
import { servicesApi } from "../services/services.service";
import type { Service } from "../types/service";
import { getLocalizedService } from "../utils/serviceTranslations";

export function useServiceDetails() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { showToast } = useToast();
  const [favoriteBusy, setFavoriteBusy] = useState(false);

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

  const service = useMemo(
    () => services.find((item) => item.id === serviceId),
    [serviceId, services],
  );
  const localizedService = service
    ? getLocalizedService(service, i18n.language)
    : null;

  const goBackToServices = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const handleStartService = useCallback(() => {
    if (!service || !localizedService) return;
    showToast(t("feedback.started", { title: localizedService.title }));
  }, [localizedService, service, showToast, t]);

  const handleToggleFavorite = useCallback(async () => {
    if (!service) return;
    setFavoriteBusy(true);
    try {
      const nextServices = await servicesApi.toggleFavorite(service.id);
      setData(nextServices);
      showToast(
        t(
          service.isFavorite
            ? "feedback.favoriteRemoved"
            : "feedback.favoriteAdded",
        ),
      );
    } catch {
      showToast(t("feedback.failed"), "error");
    } finally {
      setFavoriteBusy(false);
    }
  }, [service, setData, showToast, t]);

  return {
    error,
    favoriteBusy,
    goBackToServices,
    handleStartService,
    handleToggleFavorite,
    i18n,
    isLoading,
    localizedService,
    refetch,
    service,
    t,
  };
}
