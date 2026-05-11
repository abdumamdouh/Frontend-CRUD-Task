import * as yup from "yup";

type Translate = (key: string) => string;

export const createServiceFormSchema = (t: Translate) =>
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
  });
