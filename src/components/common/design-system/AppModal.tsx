import type { ReactNode } from "react";
import {
  Close,
  Content,
  Description,
  Overlay,
  Portal,
  Root,
  Title,
} from "@radix-ui/react-dialog";
import { X } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

interface AppModalProps {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  description?: string;
  maxWidthClassName?: string;
}

const overlayClassName =
  "fixed inset-0 z-50 bg-aeblack-950/45 backdrop-blur-sm data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0";

const contentBaseClassName =
  "app-modal-content motion-modal-panel fixed left-1/2 top-1/2 z-50 max-h-[92vh] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:border-slate-700 dark:bg-slate-950";

export function AppModal({
  isOpen,
  title,
  children,
  onClose,
  description,
  maxWidthClassName = "max-w-2xl",
}: AppModalProps) {
  const { t } = useTranslation();

  const contentClassName =
    `${contentBaseClassName} ${maxWidthClassName}`.trim();

  const handleOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  return (
    <Root open={isOpen} onOpenChange={handleOpenChange}>
      <Portal>
        <Overlay className={overlayClassName} />

        <Content
          className={contentClassName}
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-700">
            <Title className="text-xl font-bold text-aeblack-900 dark:text-whitely-50">
              {title}
            </Title>

            <Description className="sr-only">
              {description ?? title}
            </Description>

            <Close
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              aria-label={t("close")}
            >
              <X aria-hidden="true" className="h-5 w-5" />
            </Close>
          </div>

          <div className="p-5">{children}</div>
        </Content>
      </Portal>
    </Root>
  );
}
