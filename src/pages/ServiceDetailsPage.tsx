import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { servicesApi } from "../api/servicesApi";
import { AppBreadcrumbs, AppButton } from "../components/common/design-system";
import { EmptyState } from "../components/common/EmptyState";
import { ErrorState } from "../components/common/ErrorState";
import { SkeletonCard } from "../components/common/SkeletonCard";
import { useToast } from "../components/common/toastContext";
import { ServiceBanner } from "../components/services/ServiceBanner";
import { useQuery } from "../hooks/useQuery";
import type { Service } from "../types/service";
import {
  categoryBadgeClass,
  statusBadgeClass,
  tagBadgeClass,
} from "../utils/serviceBadgeStyles";
import { getLocalizedService } from "../utils/serviceTranslations";

export function ServiceDetailsPage() {
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

  const handleStartService = () => {
    if (!service || !localizedService) return;
    showToast(t("feedback.started", { title: localizedService.title }));
  };

  const handleToggleFavorite = async () => {
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
  };

  if (isLoading) {
    return (
      <section className="motion-page">
        <SkeletonCard />
      </section>
    );
  }

  if (error) {
    return <ErrorState onRetry={refetch} />;
  }

  if (!service || !localizedService) {
    return (
      <EmptyState
        title={t("serviceNotFound")}
        message={t("serviceNotFoundHelp")}
        actionLabel={t("backToServices")}
        onAction={() => navigate("/")}
      />
    );
  }

  return (
    <article className="motion-page">
      <AppBreadcrumbs
        items={[
          { label: t("services"), href: "/" },
          { label: localizedService.title },
        ]}
      />

      <div className="overflow-hidden rounded-lg border border-primary-100 bg-white shadow-soft">
        <ServiceBanner service={service} size="details" />

        <div className="grid gap-6 p-5 lg:grid-cols-[1fr_320px] lg:p-6">
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              <span
                className={`aegov-badge badge-base ${categoryBadgeClass[service.category]}`}
              >
                {localizedService.category}
              </span>
              <span
                className={`aegov-badge badge-base ${statusBadgeClass[service.status]}`}
              >
                {localizedService.status}
              </span>
              {service.isPopular ? (
                <span
                  className={`aegov-badge badge-base ${tagBadgeClass.Popular}`}
                >
                  {t("popular")}
                </span>
              ) : null}
            </div>

            <h1 className="text-3xl font-bold text-aeblack-800">
              {localizedService.title}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
              {localizedService.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {service.tags.map((tag, index) => (
                <span
                  key={tag}
                  className={`aegov-badge badge-base ${tagBadgeClass[tag]}`}
                >
                  {localizedService.tags[index]}
                </span>
              ))}
            </div>
          </div>

          <aside className="rounded-lg border border-slate-200 bg-whitely-50 p-5">
            <dl className="grid gap-4">
              <div>
                <dt className="text-sm font-semibold text-slate-500">
                  {t("processingTime")}
                </dt>
                <dd className="mt-1 text-lg font-bold text-aeblack-800">
                  {localizedService.processingTimeLabel}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-slate-500">
                  {t("fee")}
                </dt>
                <dd className="mt-1 text-lg font-bold text-aeblack-800">
                  {localizedService.feeLabel}
                </dd>
              </div>
            </dl>

            <div className="mt-6 grid gap-3">
              <AppButton onClick={handleStartService}>{t("start")}</AppButton>
              <AppButton
                variant="secondary"
                onClick={handleToggleFavorite}
                disabled={favoriteBusy}
              >
                {service.isFavorite ? t("unfavorite") : t("favorite")}
              </AppButton>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
