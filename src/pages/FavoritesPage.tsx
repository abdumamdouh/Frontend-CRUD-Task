import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { servicesApi } from "../api/servicesApi";
import { EmptyState } from "../components/common/EmptyState";
import { ErrorState } from "../components/common/ErrorState";
import { SkeletonCard } from "../components/common/SkeletonCard";
import { useToast } from "../components/common/toastContext";
import { ServiceGrid } from "../components/services/ServiceGrid";
import { useQuery } from "../hooks/useQuery";
import type { Service } from "../types/service";
import { getLocalizedService } from "../utils/serviceTranslations";

export function FavoritesPage() {
  const { t, i18n } = useTranslation();
  const { showToast } = useToast();

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

  const [favoriteBusyId, setFavoriteBusyId] = useState<string | null>(null);

  const favoriteServices = useMemo(
    () => services.filter((service) => service.isFavorite),
    [services],
  );

  const handleToggleFavorite = async (id: string) => {
    setFavoriteBusyId(id);
    try {
      const nextServices = await servicesApi.toggleFavorite(id);
      setData(nextServices);
      showToast(t("feedback.favoriteRemoved"));
    } catch {
      showToast(t("feedback.failed"), "error");
    } finally {
      setFavoriteBusyId(null);
    }
  };

  const handleStartService = (service: Service) => {
    const localizedService = getLocalizedService(service, i18n.language);
    showToast(t("feedback.started", { title: localizedService.title }));
  };

  return (
    <section className="motion-page">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-aeblack-800">
          {t("favoriteServices")}
        </h1>
      </div>

      {isLoading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : error ? (
        <ErrorState onRetry={refetch} />
      ) : favoriteServices.length === 0 ? (
        <EmptyState title={t("noFavorites")} message={t("noFavoritesHelp")} />
      ) : (
        <ServiceGrid
          services={favoriteServices}
          onToggleFavorite={handleToggleFavorite}
          onStart={handleStartService}
          favoriteBusyId={favoriteBusyId}
        />
      )}
    </section>
  );
}
