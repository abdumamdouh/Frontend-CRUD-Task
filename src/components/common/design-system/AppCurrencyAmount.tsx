import { useMemo } from "react";

interface AppCurrencyAmountProps {
  amount: number;
  locale?: string;
  className?: string;
}

export function AppCurrencyAmount({
  amount,
  locale = "en-AE",
  className = "",
}: AppCurrencyAmountProps) {
  const formattedAmount = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        maximumFractionDigits: 0,
      }).format(amount),
    [amount, locale],
  );

  return (
    <span
      className={`app-currency-amount ${className}`}
      dir="ltr"
      aria-label={`UAE dirham ${formattedAmount}`}
    >
      <span className="app-currency-symbol" aria-hidden="true" />

      <span>{formattedAmount}</span>
    </span>
  );
}
