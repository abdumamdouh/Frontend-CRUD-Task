import { useTranslation } from "react-i18next";
import { AppButton, AppModal } from "./design-system";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  isConfirming?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel,
  isConfirming = false,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  const { t } = useTranslation();

  return (
    <AppModal
      isOpen={isOpen}
      title={title}
      description={message}
      onClose={onCancel}
      maxWidthClassName="max-w-md"
    >
      <p className="text-sm leading-6 text-slate-600">{message}</p>

      <div className="mt-6 flex justify-end gap-3">
        <AppButton
          variant="secondary"
          onClick={onCancel}
          disabled={isConfirming}
        >
          {t("cancel")}
        </AppButton>

        <AppButton variant="danger" onClick={onConfirm} disabled={isConfirming}>
          {isConfirming ? t("deleting") : confirmLabel}
        </AppButton>
      </div>
    </AppModal>
  );
}
