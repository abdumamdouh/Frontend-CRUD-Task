import { AppButton } from "./design-system";

interface EmptyStateProps {
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-primary-200 bg-white px-6 py-12 text-center shadow-sm">
      <div className="mx-auto mb-5 grid h-24 w-24 place-items-center rounded-full bg-primary-50">
        <svg
          viewBox="0 0 96 96"
          aria-hidden="true"
          className="h-16 w-16 text-primary-600"
        >
          <path
            d="M24 30a10 10 0 0 1 10-10h28a10 10 0 0 1 10 10v36a10 10 0 0 1-10 10H34a10 10 0 0 1-10-10V30Z"
            fill="currentColor"
            opacity="0.12"
          />
          <path
            d="M34 34h28M34 46h22M34 58h16"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M66 65 76 75"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle
            cx="61"
            cy="60"
            r="10"
            fill="white"
            stroke="currentColor"
            strokeWidth="5"
          />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-aeblack-800">{title}</h2>
      {message ? (
        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">
          {message}
        </p>
      ) : null}
      {actionLabel && onAction ? (
        <AppButton className="mt-5" variant="secondary" onClick={onAction}>
          {actionLabel}
        </AppButton>
      ) : null}
    </div>
  );
}
