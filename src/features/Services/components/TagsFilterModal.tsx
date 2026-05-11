import { memo, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppButton, AppModal } from "../../../components/common/design-system";
import type { ServiceTag } from "../types/service";
import { tagBadgeClass } from "../utils/serviceBadgeStyles";
import { translateTag } from "../utils/serviceTranslations";

interface TagsFilterModalProps {
  allTags: ServiceTag[];
  selectedTags: ServiceTag[];
  onApplyTags: (tags: ServiceTag[]) => void;
  onClearTags: () => void;
}

function TagsFilterModalComponent({
  allTags,
  selectedTags,
  onApplyTags,
  onClearTags,
}: TagsFilterModalProps) {
  const { t, i18n } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const [draftTags, setDraftTags] = useState<ServiceTag[]>(selectedTags);

  const selectedCount = selectedTags.length;
  const hasSelectedTags = selectedCount > 0;
  const selectedPreviewTags = selectedTags.slice(0, 4);

  const toggleDraftTag = useCallback((tag: ServiceTag) => {
    setDraftTags((current) =>
      current.includes(tag)
        ? current.filter((item) => item !== tag)
        : [...current, tag],
    );
  }, []);

  const applyTags = useCallback(() => {
    onApplyTags(draftTags);
    setIsOpen(false);
  }, [draftTags, onApplyTags]);

  const openTagsModal = useCallback(() => {
    setDraftTags(selectedTags);
    setIsOpen(true);
  }, [selectedTags]);

  const closeTagsModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const clearDraftTags = useCallback(() => {
    setDraftTags([]);
  }, []);

  const tagsHeaderElement = (
    <div className="mb-2 flex items-center justify-between gap-3">
      <span className="text-sm font-semibold text-slate-700">{t("tags")}</span>

      {hasSelectedTags && (
        <button
          type="button"
          className="text-xs font-semibold text-primary-700 underline-offset-4 hover:underline"
          onClick={onClearTags}
        >
          {t("clearTags")}
        </button>
      )}
    </div>
  );

  const tagsTriggerElement = (
    <button
      type="button"
      className="tags-filter-trigger flex min-h-12 w-full items-center justify-between gap-3 rounded-lg border border-slate-200 bg-whitely-50 px-4 py-3 text-start shadow-sm transition hover:border-primary-200 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-200"
      onClick={openTagsModal}
    >
      <span className="text-sm font-semibold text-aeblack-800">
        {hasSelectedTags
          ? t("selectedTagsCount", { count: selectedCount })
          : t("chooseTags")}
      </span>

      <span className="text-sm text-slate-500">{t("open")}</span>
    </button>
  );

  const selectedTagsPreviewElement = hasSelectedTags && (
    <div className="mt-3 flex flex-wrap gap-2">
      {selectedPreviewTags.map((tag) => (
        <span
          key={tag}
          className={`aegov-badge badge-base ${tagBadgeClass[tag]}`}
        >
          {translateTag(tag, i18n.language)}
        </span>
      ))}

      {selectedCount > 4 && (
        <span className="aegov-badge badge-base border-secondary-100 bg-secondary-50 text-secondary-700">
          {t("moreTags", { count: selectedCount - 4 })}
        </span>
      )}
    </div>
  );

  const modalTagOptionsElement = (
    <div className="grid gap-3 sm:grid-cols-2">
      {allTags.map((tag) => {
        const selected = draftTags.includes(tag);

        return (
          <button
            key={tag}
            type="button"
            className={`service-tag-option rounded-lg border px-4 py-3 text-start text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              selected
                ? "border-primary-600 bg-primary-600 text-whitely-50"
                : `service-chip ${tagBadgeClass[tag]} hover:brightness-95`
            }`}
            aria-pressed={selected}
            onClick={() => toggleDraftTag(tag)}
          >
            {translateTag(tag, i18n.language)}
          </button>
        );
      })}
    </div>
  );

  const modalActionsElement = (
    <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
      <AppButton variant="secondary" onClick={clearDraftTags}>
        {t("clearTags")}
      </AppButton>

      <AppButton onClick={applyTags}>{t("done")}</AppButton>
    </div>
  );

  return (
    <div>
      {tagsHeaderElement}

      {tagsTriggerElement}

      {selectedTagsPreviewElement}

      <AppModal
        isOpen={isOpen}
        title={t("filterByTags")}
        onClose={closeTagsModal}
        maxWidthClassName="max-w-xl"
      >
        <div className="grid gap-5">
          {modalTagOptionsElement}

          {modalActionsElement}
        </div>
      </AppModal>
    </div>
  );
}

export const TagsFilterModal = memo(TagsFilterModalComponent);
