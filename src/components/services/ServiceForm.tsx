import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { categories, statuses, tags } from "../../config/theme";
import type {
  Service,
  ServiceCategory,
  ServiceFormValues,
  ServicePayload,
  ServiceStatus,
  ServiceTag,
} from "../../types/service";
import { tagBadgeClass } from "../../utils/serviceBadgeStyles";
import {
  translateCategory,
  getLocalizedService,
  translateStatus,
  translateTag,
} from "../../utils/serviceTranslations";
import {
  AppButton,
  AppCheckbox,
  AppInput,
  AppSelect,
  AppTextarea,
} from "../common/design-system";

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

  const schema = useMemo(
    () =>
      yup.object({
        title: yup
          .string()
          .required(t("validation.titleRequired"))
          .min(3, t("validation.titleMin")),
        description: yup
          .string()
          .required(t("validation.descriptionRequired"))
          .min(10, t("validation.descriptionMin")),
        category: yup.string().required(t("validation.categoryRequired")),
        status: yup.string().required(t("validation.statusRequired")),
        processingTime: yup
          .number()
          .typeError(t("validation.processingRequired"))
          .required(t("validation.processingRequired"))
          .positive(t("validation.processingPositive")),
        fee: yup
          .number()
          .typeError(t("validation.feeRequired"))
          .required(t("validation.feeRequired"))
          .min(0, t("validation.feePositive")),
        tags: yup
          .array()
          .of(yup.string().required())
          .min(1, t("validation.tagsRequired")),
        isPopular: yup.boolean(),
      }),
    [t],
  );

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
      if (!(validationError instanceof yup.ValidationError)) return;
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
        onChange={(event) => updateValue("title", event.target.value)}
        error={errors.title}
      />

      <AppTextarea
        label={t("description")}
        value={values.description}
        placeholder={t("description")}
        maxLength={220}
        showCount
        onChange={(event) => updateValue("description", event.target.value)}
        error={errors.description}
        rows={4}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <AppSelect
          label={t("category")}
          value={values.category || undefined}
          onChange={(value) =>
            updateValue("category", value as ServiceCategory)
          }
          options={categories.map((category) => ({
            value: category,
            label: translateCategory(category, i18n.language),
          }))}
          placeholder={t("allCategories")}
          error={errors.category}
        />

        <AppSelect
          label={t("status")}
          value={values.status}
          onChange={(value) => updateValue("status", value as ServiceStatus)}
          options={statuses.map((status) => ({
            value: status,
            label: translateStatus(status, i18n.language),
          }))}
          error={errors.status}
        />
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-slate-700">
          {t("selectTags")}
        </legend>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-600 ${
                values.tags.includes(tag)
                  ? "border-primary-600 bg-primary-600 text-whitely-50"
                  : `aegov-badge badge-base ${tagBadgeClass[tag]}`
              }`}
              aria-pressed={values.tags.includes(tag)}
              onClick={() => toggleTag(tag)}
            >
              {translateTag(tag, i18n.language)}
            </button>
          ))}
        </div>
        {errors.tags ? (
          <span className="mt-1 block text-sm text-red-700">{errors.tags}</span>
        ) : null}
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <AppInput
          label={t("processingTime")}
          type="number"
          min="1"
          placeholder="5"
          value={values.processingTime}
          onChange={(event) =>
            updateValue("processingTime", event.target.value)
          }
          error={errors.processingTime}
        />

        <AppInput
          label={t("fee")}
          type="number"
          min="0"
          placeholder="0"
          value={values.fee}
          onChange={(event) => updateValue("fee", event.target.value)}
          error={errors.fee}
        />
      </div>

      <AppCheckbox
        checked={values.isPopular}
        onCheckedChange={(checked) => updateValue("isPopular", checked)}
        label={t("isPopular")}
      />

      <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
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
