import { memo } from "react";
import type { Service, ServiceTag } from "../types/service";
import { ServiceCard } from "./ServiceCard";

interface ServiceGridProps {
  services: Service[];
  onToggleFavorite: (id: string) => void;
  onStart?: (service: Service) => void;
  onEdit?: (service: Service) => void;
  onDelete?: (service: Service) => void;
  onTagClick?: (tag: ServiceTag) => void;
  favoriteBusyId?: string | null;
  deletingId?: string | null;
}

function ServiceGridComponent({
  services,
  onToggleFavorite,
  onStart,
  onEdit,
  onDelete,
  onTagClick,
  favoriteBusyId,
  deletingId,
}: ServiceGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {services.map((service, index) => (
        <div
          key={service.id}
          className="motion-card h-full"
          style={{ animationDelay: `${index * 35}ms` }}
        >
          <ServiceCard
            service={service}
            onToggleFavorite={onToggleFavorite}
            onStart={onStart}
            onEdit={onEdit}
            onDelete={onDelete}
            onTagClick={onTagClick}
            isFavoriteBusy={favoriteBusyId === service.id}
            isDeleting={deletingId === service.id}
          />
        </div>
      ))}
    </div>
  );
}

export const ServiceGrid = memo(ServiceGridComponent);
