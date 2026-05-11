import {
  useCallback,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { TFunction } from "i18next";
import { useToast } from "../../../components/common/toastContext";
import { servicesApi } from "../services";
import type { Service, ServicePayload } from "../types";
import { getLocalizedService } from "../utils/serviceTranslations";

interface UseServiceActionsOptions {
  language: string;
  resetFilters: () => void;
  services: Service[];
  setData: Dispatch<SetStateAction<Service[]>>;
  t: TFunction;
}

export function useServiceActions({
  language,
  resetFilters,
  services,
  setData,
  t,
}: UseServiceActionsOptions) {
  const { showToast } = useToast();

  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [favoriteBusyId, setFavoriteBusyId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [servicePendingDelete, setServicePendingDelete] =
    useState<Service | null>(null);

  const [isResetting, setIsResetting] = useState(false);

  const openCreateForm = useCallback(() => {
    setEditingService(null);
    setIsFormOpen(true);
  }, []);

  const openEditForm = useCallback((service: Service) => {
    setEditingService(service);
    setIsFormOpen(true);
  }, []);

  const closeForm = useCallback(() => {
    setIsFormOpen(false);
  }, []);

  const handleStartService = useCallback(
    (service: Service) => {
      const serviceTitle = getLocalizedService(service, language).title;
      showToast(t("feedback.started", { title: serviceTitle }));
    },
    [language, showToast, t],
  );

  const handleSubmit = useCallback(
    async (payload: ServicePayload) => {
      setIsSaving(true);

      try {
        const isEditing = Boolean(editingService);
        const feedbackKey = isEditing ? "feedback.updated" : "feedback.created";
        const nextServices = editingService
          ? await servicesApi.updateService(
              editingService.id,
              payload,
              language,
            )
          : await servicesApi.createService(payload);

        setData(nextServices);
        setIsFormOpen(false);
        setEditingService(null);
        showToast(t(feedbackKey));
      } catch {
        showToast(t("feedback.failed"), "error");
      } finally {
        setIsSaving(false);
      }
    },
    [editingService, language, setData, showToast, t],
  );

  const handleToggleFavorite = useCallback(
    async (id: string) => {
      setFavoriteBusyId(id);

      try {
        const wasFavorite = services.find(
          (service) => service.id === id,
        )?.isFavorite;

        const feedbackKey = wasFavorite
          ? "feedback.favoriteRemoved"
          : "feedback.favoriteAdded";

        const nextServices = await servicesApi.toggleFavorite(id);

        setData(nextServices);
        showToast(t(feedbackKey));
      } catch {
        showToast(t("feedback.failed"), "error");
      } finally {
        setFavoriteBusyId(null);
      }
    },
    [services, setData, showToast, t],
  );

  const openDeleteDialog = useCallback((service: Service) => {
    setServicePendingDelete(service);
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setServicePendingDelete(null);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!servicePendingDelete) return;
    setDeletingId(servicePendingDelete.id);
    try {
      const nextServices = await servicesApi.deleteService(
        servicePendingDelete.id,
      );

      setData(nextServices);
      setServicePendingDelete(null);

      showToast(t("feedback.deleted"));
    } catch {
      showToast(t("feedback.failed"), "error");
    } finally {
      setDeletingId(null);
    }
  }, [servicePendingDelete, setData, showToast, t]);

  const handleResetData = useCallback(async () => {
    setIsResetting(true);
    try {
      const nextServices = await servicesApi.resetServices();

      setData(nextServices);
      resetFilters();
      showToast(t("feedback.reset"));
    } catch {
      showToast(t("feedback.failed"), "error");
    } finally {
      setIsResetting(false);
    }
  }, [resetFilters, setData, showToast, t]);

  return {
    closeDeleteDialog,
    closeForm,
    deletingId,
    editingService,
    favoriteBusyId,
    handleConfirmDelete,
    handleResetData,
    handleStartService,
    handleSubmit,
    handleToggleFavorite,
    isFormOpen,
    isResetting,
    isSaving,
    openCreateForm,
    openDeleteDialog,
    openEditForm,
    servicePendingDelete,
  };
}
