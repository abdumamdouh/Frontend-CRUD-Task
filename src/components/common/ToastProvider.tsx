import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AppToast } from "./design-system";
import { ToastContext } from "./toastContext";
import type { ToastContextValue, ToastType } from "./toastContext";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

const toastStyles: Record<ToastType, string> = {
  success:
    "border-primary-900 bg-primary-900 text-whitely-50 shadow-xl shadow-primary-900/20",
  error:
    "border-aered-800 bg-aered-700 text-white shadow-xl shadow-aered-900/20",
};

const dotStyles: Record<ToastType, string> = {
  success: "bg-aegold-400",
  error: "bg-white",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const value = useMemo<ToastContextValue>(
    () => ({
      showToast(message, type = "success") {
        const id = crypto.randomUUID();
        setToasts((current) => [...current, { id, message, type }]);

        window.setTimeout(() => {
          setToasts((current) => current.filter((toast) => toast.id !== id));
        }, 3200);
      },
    }),
    [],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      {toasts.map((toast) => (
        <AppToast key={toast.id} showToast duration={3200}>
          <div
            role="status"
            className={`motion-toast flex items-start gap-3 rounded-lg border px-4 py-3 text-sm font-semibold ${toastStyles[toast.type]}`}
          >
            <span
              className={`mt-1 h-2.5 w-2.5 rounded-full ${dotStyles[toast.type]}`}
            />

            <span className="leading-6">{toast.message}</span>
          </div>
        </AppToast>
      ))}
    </ToastContext.Provider>
  );
}
