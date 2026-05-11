import { EmptyState } from "../../../components/common/EmptyState";
import { ErrorState } from "../../../components/common/ErrorState";
import { SkeletonCard } from "../../../components/common/SkeletonCard";
import { ServiceGrid } from "../components/ServiceGrid";
import { useFavoriteServices } from "../hooks/useFavoriteServices";

export function FavoritesPage() {
  const {
    error,
    favoriteBusyId,
    favoriteServices,
    handleStartService,
    handleToggleFavorite,
    isLoading,
    refetch,
    t,
  } = useFavoriteServices();

  const renderContent = () => {
    switch (true) {
      case isLoading:
        return (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }, (_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        );

      case Boolean(error):
        return <ErrorState onRetry={refetch} />;

      case favoriteServices.length === 0:
        return (
          <EmptyState title={t("noFavorites")} message={t("noFavoritesHelp")} />
        );

      default:
        return (
          <ServiceGrid
            services={favoriteServices}
            onToggleFavorite={handleToggleFavorite}
            onStart={handleStartService}
            favoriteBusyId={favoriteBusyId}
          />
        );
    }
  };

  return (
    <section className="motion-page">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-aeblack-800">
          {t("favoriteServices")}
        </h1>
      </div>

      {renderContent()}
    </section>
  );
}
