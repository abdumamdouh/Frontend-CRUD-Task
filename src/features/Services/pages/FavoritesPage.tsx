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
