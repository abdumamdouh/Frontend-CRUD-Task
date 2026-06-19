import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { ValidationError } from "yup";
import { categories, statuses, tags } from "../constants/serviceOptions";

import { tagBadgeClass } from "../utils/serviceBadgeStyles";
import { createServiceFormSchema } from "../utils/serviceFormSchema";
import {
  translateCategory,
  getLocalizedService,
  translateStatus,
  translateTag,
} from "../utils/serviceTranslations";
import type {
  Service,
  ServiceCategory,
  ServiceFormValues,
  ServicePayload,
  ServiceStatus,
  ServiceTag,
} from "../types/service";
import {
  AppButton,
  AppCheckbox,
  AppInput,
  AppSelect,
  AppTextarea,
} from "../../../components/common/design-system";

type ServiceFormErrors = Partial<Record<keyof ServiceFormValues, string>>;
type ServiceFormField = keyof ServiceFormValues;

interface ServiceFormProps {
  service?: Service | null;
  onSubmit: (payload: ServicePayload) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}

const emptyValues: ServiceFormValues = {
  title: "",
  description: "",
  category: "",
  status: "Available",
  tags: [],
  processingTime: "",
  fee: "",
  isPopular: false,
};

export function ServiceForm({
  service,
  onSubmit,
  onCancel,
  isSaving,
}: ServiceFormProps) {
  const { t, i18n } = useTranslation();

  const [values, setValues] = useState(() =>
    getServiceFormValues(service, i18n.language),
  );
  const [errors, setErrors] = useState<ServiceFormErrors>({});

  const categoryOptions = useMemo(
    () =>
      categories.map((category) => ({
        value: category,
        label: translateCategory(category, i18n.language),
      })),
    [i18n.language],
  );

  const statusOptions = useMemo(
    () =>
      statuses.map((status) => ({
        value: status,
        label: translateStatus(status, i18n.language),
      })),
    [i18n.language],
  );

  const schema = useMemo(() => createServiceFormSchema(t), [t]);

  const updateValue = <TField extends ServiceFormField>(
    name: TField,
    value: ServiceFormValues[TField],
  ) => {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const toggleTag = (tag: ServiceTag) => {
    const nextTags = values.tags.includes(tag)
      ? values.tags.filter((item) => item !== tag)
      : [...values.tags, tag];
    updateValue("tags", nextTags);
  };

  const handleTitleChange = (value: string) => updateValue("title", value);

  const handleDescriptionChange = (value: string) =>
    updateValue("description", value);

  const handleCategoryChange = (value: string) =>
    updateValue("category", value as ServiceCategory);

  const handleStatusChange = (value: string) =>
    updateValue("status", value as ServiceStatus);

  const handleProcessingTimeChange = (value: string) =>
    updateValue("processingTime", value);

  const handleFeeChange = (value: string) => updateValue("fee", value);

  const handleIsPopularChange = (checked: boolean) =>
    updateValue("isPopular", checked);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const validated = await schema.validate(values, { abortEarly: false });
      const validatedTags = (validated.tags ?? []) as ServiceTag[];

      const payload = {
        ...validated,
        category: validated.category as ServiceCategory,
        status: validated.status as ServiceStatus,
        isPopular: Boolean(validated.isPopular),
        tags:
          validated.isPopular && !validatedTags.includes("Popular")
            ? [...validatedTags, "Popular"]
            : validatedTags,
      } satisfies ServicePayload;

      await onSubmit(payload);
    } catch (validationError) {
      if (!(validationError instanceof ValidationError)) return;

      const nextErrors: ServiceFormErrors = {};

      validationError.inner.forEach((error) => {
        if (error.path) {
          nextErrors[error.path as ServiceFormField] = error.message;
        }
      });

      setErrors(nextErrors);
    }
  };

  return (
    <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
      <AppInput
        label={t("title")}
        value={values.title}
        placeholder={t("title")}
        onChange={(event) => handleTitleChange(event.target.value)}
        error={errors.title}
      />

      <AppTextarea
        label={t("description")}
        value={values.description}
        placeholder={t("description")}
        maxLength={220}
        showCount
        onChange={(event) => handleDescriptionChange(event.target.value)}
        error={errors.description}
        rows={3}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <AppSelect
          label={t("category")}
          value={values.category || undefined}
          onChange={handleCategoryChange}
          options={categoryOptions}
          placeholder={t("allCategories")}
          error={errors.category}
        />

        <AppSelect
          label={t("status")}
          value={values.status}
          onChange={handleStatusChange}
          options={statusOptions}
          error={errors.status}
        />
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-slate-700">
          {t("selectTags")}
        </legend>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => {
            const isSelected = values.tags.includes(tag);

            return (
              <button
                key={tag}
                type="button"
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-600 ${
                  isSelected
                    ? "border-primary-600 bg-primary-600 text-whitely-50"
                    : `aegov-badge badge-base ${tagBadgeClass[tag]}`
                }`}
                aria-pressed={isSelected}
                onClick={() => toggleTag(tag)}
              >
                {translateTag(tag, i18n.language)}
              </button>
            );
          })}
        </div>

        {errors.tags && (
          <span className="mt-1 block text-sm text-red-700">{errors.tags}</span>
        )}
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <AppInput
          label={t("processingTime")}
          type="number"
          min="1"
          placeholder="5"
          value={values.processingTime}
          onChange={(event) => handleProcessingTimeChange(event.target.value)}
          error={errors.processingTime}
        />

        <AppInput
          label={t("fee")}
          type="number"
          min="0"
          placeholder="0"
          value={values.fee}
          onChange={(event) => handleFeeChange(event.target.value)}
          error={errors.fee}
        />
      </div>

      <AppCheckbox
        checked={values.isPopular}
        onCheckedChange={handleIsPopularChange}
        label={t("isPopular")}
      />

      <div className="sticky bottom-0 z-10 -mx-5 -mb-5 flex justify-end gap-3 border-t border-slate-200 bg-white px-5 py-4 dark:border-slate-700 dark:bg-slate-950">
        <AppButton variant="secondary" onClick={onCancel}>
          {t("cancel")}
        </AppButton>

        <AppButton type="submit" disabled={isSaving}>
          {isSaving ? t("saving") : t("save")}
        </AppButton>
      </div>
    </form>
  );
}

const getServiceFormValues = (
  service: Service | null | undefined,
  language: string,
): ServiceFormValues => {
  if (!service) return emptyValues;
  const localizedService = getLocalizedService(service, language);

  return {
    title: localizedService.title,
    description: localizedService.description,
    category: service.category,
    status: service.status,
    tags: service.tags.filter((tag) => tags.includes(tag)),
    processingTime: String(service.processingTime),
    fee: String(service.fee),
    isPopular: service.isPopular,
  };
};
