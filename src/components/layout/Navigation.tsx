import { NavLink } from "react-router-dom";
import type { NavLinkRenderProps } from "react-router-dom";
import { useTranslation } from "react-i18next";

const linkClass = ({ isActive }: NavLinkRenderProps) =>
  `rounded-md border px-3 py-2 text-sm font-semibold no-underline transition focus:outline-none focus:ring-2 focus:ring-primary-600 ${
    isActive
      ? "border-primary-600 bg-primary-600 text-whitely-50"
      : "border-secondary-100 bg-white text-secondary-800 hover:border-primary-100 hover:bg-primary-50 hover:text-primary-700"
  }`;

export function Navigation() {
  const { t } = useTranslation();

  return (
    <nav
      className="flex items-center gap-2"
      aria-label={t("primaryNavigation")}
    >
      <NavLink to="/" className={linkClass}>
        {t("services")}
      </NavLink>

      <NavLink to="/favorites" className={linkClass}>
        {t("favorites")}
      </NavLink>
    </nav>
  );
}
