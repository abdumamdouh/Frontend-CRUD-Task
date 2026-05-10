import { useTranslation } from "react-i18next";
import { AppButton } from "./design-system";

interface ErrorStateProps {
  onRetry: () => void;
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 px-6 py-8 text-center text-red-900">
      <h2 className="text-lg font-semibold">{t("somethingWrong")}</h2>
      <AppButton className="mt-4" variant="secondary" onClick={onRetry}>
        {t("tryAgain")}
      </AppButton>
    </div>
  );
}
