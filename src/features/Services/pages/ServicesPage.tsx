import { ConfirmDialog } from "../../../components/common/ConfirmDialog";
import { EmptyState } from "../../../components/common/EmptyState";
import { ErrorState } from "../../../components/common/ErrorState";
import { AppModal } from "../../../components/common/design-system";
import { Pagination } from "../../../components/common/Pagination";
import { SkeletonCard } from "../../../components/common/SkeletonCard";
import { ServiceForm } from "../components/ServiceForm";
import { ServiceGrid } from "../components/ServiceGrid";
import { ServicesToolbar } from "../components/ServicesToolbar";
import { useServicesDirectory } from "../hooks/useServicesDirectory";

export function ServicesPage() {
  const {
    changePage,
    closeDeleteDialog,
    closeForm,
    currentPage,
    deletingId,
    editingService,
    error,
    favoriteBusyId,
    filters,
    handleConfirmDelete,
    handleFiltersChange,
    handleResetData,
    handleStartService,
    handleSubmit,
    handleTagFilter,
    handleToggleFavorite,
    i18n,
    isFormOpen,
    isLoading,
    isResetting,
    isSaving,
    openCreateForm,
    openDeleteDialog,
    openEditForm,
    pageCount,
    pageServices,
    refetch,
    resetFilters,
    searchTerm,
    servicePendingDelete,
    services,
    setSearchTerm,
    setSortOption,
    sortedServices,
    sortOption,
    t,
  } = useServicesDirectory();

  const servicesSummaryElement = (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-aeblack-800">
        {t("allServices")}
      </h1>

      <p className="mt-2 text-sm text-slate-600">
        {t("showingResults", {
          shown: pageServices.length,
          total: sortedServices.length,
        })}
      </p>
    </div>
  );

  const loadingElement = (
    <div>
      <p className="mb-4 text-sm font-semibold text-slate-700">
        {t("loadingServices")}
      </p>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </div>
  );

  const servicesListElement = (
    <>
      <ServiceGrid
        services={pageServices}
        onToggleFavorite={handleToggleFavorite}
        onStart={handleStartService}
        onEdit={openEditForm}
        onDelete={openDeleteDialog}
        onTagClick={handleTagFilter}
        favoriteBusyId={favoriteBusyId}
        deletingId={deletingId}
      />

      <Pagination
        currentPage={currentPage}
        pageCount={pageCount}
        onPageChange={changePage}
      />
    </>
  );

  const renderContent = () => {
    switch (true) {
      case isLoading:
        return loadingElement;

      case Boolean(error):
        return <ErrorState onRetry={refetch} />;

      case pageServices.length === 0:
        return (
          <EmptyState
            title={t("noServicesFound")}
            message={t("noServicesHelp")}
          />
        );

      default:
        return servicesListElement;
    }
  };

  return (
    <section className="motion-page">
      {servicesSummaryElement}

      <ServicesToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        sortOption={sortOption}
        onSortChange={setSortOption}
        onResetFilters={resetFilters}
        onAddService={openCreateForm}
        onResetData={handleResetData}
        isResetting={isResetting}
        totalCount={services.length}
        resultCount={sortedServices.length}
      />

      {renderContent()}

      <AppModal
        isOpen={isFormOpen}
        title={editingService ? t("editService") : t("addService")}
        onClose={closeForm}
      >
        <ServiceForm
          key={`${editingService?.id ?? "new"}-${i18n.language}`}
          service={editingService}
          onSubmit={handleSubmit}
          onCancel={closeForm}
          isSaving={isSaving}
        />
      </AppModal>

      <ConfirmDialog
        isOpen={Boolean(servicePendingDelete)}
        title={t("deleteServiceTitle")}
        message={t("deleteServiceMessage", {
          title: servicePendingDelete?.title,
        })}
        confirmLabel={t("delete")}
        isConfirming={Boolean(deletingId)}
        onCancel={closeDeleteDialog}
        onConfirm={handleConfirmDelete}
      />
    </section>
  );
}
