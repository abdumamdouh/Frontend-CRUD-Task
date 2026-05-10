import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Heart, PencilSimple, Trash } from "@phosphor-icons/react";
import type { Service, ServiceTag } from "../../types/service";
import {
  categoryBadgeClass,
  statusBadgeClass,
  tagBadgeClass,
} from "../../utils/serviceBadgeStyles";
import { getLocalizedService } from "../../utils/serviceTranslations";
import {
  AppButton,
  AppCard,
  AppIconButton,
  TruncatedTooltip,
} from "../common/design-system";
import { ServiceBanner } from "./ServiceBanner";

const truncateTitle = (title: string, maxLength = 96) =>
  title.length > maxLength ? `${title.slice(0, maxLength - 1).trim()}…` : title;

interface ServiceCardProps {
  service: Service;
  onToggleFavorite: (id: string) => void;
  onStart?: (service: Service) => void;
  onEdit?: (service: Service) => void;
  onDelete?: (service: Service) => void;
  onTagClick?: (tag: ServiceTag) => void;
  isFavoriteBusy?: boolean;
  isDeleting?: boolean;
}

function ServiceCardComponent({
  service,
  onToggleFavorite,
  onStart,
  onEdit,
  onDelete,
  onTagClick,
  isFavoriteBusy,
  isDeleting,
}: ServiceCardProps) {
  const { t, i18n } = useTranslation();
  const localizedService = getLocalizedService(service, i18n.language);
  const favoriteLabel = service.isFavorite
    ? `${t("unfavorite")} ${localizedService.title}`
    : `${t("favorite")} ${localizedService.title}`;
  const detailsPath = `/services/${service.id}`;
  const displayTitle = truncateTitle(localizedService.title);
  const visibleTags = service.tags.slice(0, 3);
  const hiddenTagsCount = Math.max(service.tags.length - visibleTags.length, 0);

  return (
    <AppCard
      asChild
      variant="default"
      className="group flex h-full min-h-72 flex-col border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-primary-100 hover:bg-primary-50/25 hover:shadow-soft"
    >
      <article>
        <div className="flex h-full flex-col">
          <Link
            to={detailsPath}
            className="mb-3 grid h-32 place-items-center overflow-hidden rounded-md bg-primary-50 text-center no-underline outline-none transition group-hover:bg-primary-100 focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            <ServiceBanner service={service} />
          </Link>

          <div className="grid min-h-20 content-start gap-2">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div
                  className="flex flex-wrap gap-2"
                  aria-label={t("category")}
                >
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
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                {onEdit ? (
                  <AppIconButton
                    label={t("editServiceLabel", {
                      title: localizedService.title,
                    })}
                    onClick={() => onEdit(service)}
                    icon={<PencilSimple weight="regular" />}
                  />
                ) : null}
                {onDelete ? (
                  <AppIconButton
                    tone="danger"
                    label={t("deleteServiceLabel", {
                      title: localizedService.title,
                    })}
                    onClick={() => onDelete(service)}
                    disabled={isDeleting}
                    icon={<Trash weight="regular" />}
                  />
                ) : null}
                <AppIconButton
                  tone="primary"
                  label={favoriteLabel}
                  onClick={() => onToggleFavorite(service.id)}
                  disabled={isFavoriteBusy}
                  icon={
                    <Heart weight={service.isFavorite ? "fill" : "regular"} />
                  }
                />
              </div>
            </div>

            <div className="min-w-0 overflow-hidden">
              <TruncatedTooltip
                content={localizedService.title}
                side="bottom"
                forceWhen={displayTitle !== localizedService.title}
              >
                <h2 className="min-h-8 max-w-full text-lg font-bold text-aeblack-800">
                  <Link
                    to={detailsPath}
                    aria-label={localizedService.title}
                    className="block max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-aeblack-800 no-underline outline-none hover:text-primary-700 focus-visible:ring-2 focus-visible:ring-primary-500"
                  >
                    {displayTitle}
                  </Link>
                </h2>
              </TruncatedTooltip>
            </div>
          </div>

          <TruncatedTooltip
            content={localizedService.description}
            side="top"
            forceWhen={localizedService.description.length > 120}
          >
            <p className="service-card-description mt-3 text-sm text-slate-600">
              {localizedService.description}
            </p>
          </TruncatedTooltip>

          <div className="mt-4 flex min-h-7 flex-wrap gap-2">
            {visibleTags.map((tag, index) => (
              <button
                key={tag}
                type="button"
                className={`service-chip aegov-badge badge-base !rounded !px-2 !py-0.5 transition hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-primary-500 ${tagBadgeClass[tag]}`}
                onClick={() => onTagClick?.(tag)}
                aria-label={t("filterByTag", {
                  tag: localizedService.tags[index],
                })}
              >
                {localizedService.tags[index]}
              </button>
            ))}
            {hiddenTagsCount ? (
              <span className="aegov-badge badge-base border-secondary-100 bg-secondary-50 text-secondary-700">
                {t("moreTags", { count: hiddenTagsCount })}
              </span>
            ) : null}
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-200 pt-4 text-sm">
            <div>
              <dt className="font-semibold text-slate-500">
                {t("processingTime")}
              </dt>
              <dd className="mt-1 text-aeblack-800">
                {localizedService.processingTimeLabel}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-500">{t("fee")}</dt>
              <dd className="mt-1 text-aeblack-800">
                {localizedService.feeLabel}
              </dd>
            </div>
          </dl>

          <div className="mt-auto grid gap-2 pt-5 sm:grid-cols-2">
            <AppButton onClick={() => onStart?.(service)}>
              {t("start")}
            </AppButton>
            <AppButton asChild variant="secondary">
              <Link to={detailsPath}>{t("details")}</Link>
            </AppButton>
          </div>
        </div>
      </article>
    </AppCard>
  );
}

export const ServiceCard = memo(ServiceCardComponent);
