import { useTranslation } from "react-i18next";
import { AppSelect } from "../common/design-system";

interface LanguageSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function LanguageSelect({ value, onChange }: LanguageSelectProps) {
  const { t } = useTranslation();

  const languageOptions = [
    { value: "en", label: t("english") },
    { value: "ar", label: t("arabic") },
  ];

  return (
    <div className="min-w-32">
      <AppSelect
        size="sm"
        value={value}
        onChange={onChange}
        options={languageOptions}
        placeholder={t("language")}
      />
    </div>
  );
}
