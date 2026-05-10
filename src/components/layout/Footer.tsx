import { GithubLogo, LinkedinLogo } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

const authorLinks = [
  {
    href: "https://github.com/abdumamdouh",
    label: "GitHub",
    icon: GithubLogo,
  },
  {
    href: "https://www.linkedin.com/in/abdumamdouh/",
    label: "LinkedIn",
    icon: LinkedinLogo,
  },
];

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-primary-100 bg-whitely-50">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>
          {t("builtBy")}{" "}
          <span className="font-semibold text-aeblack-800">
            Abdulrahman Mamdouh
          </span>
        </p>
        <div className="flex items-center gap-2">
          {authorLinks.map(({ href, label, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-secondary-100 bg-white px-3 py-2 font-semibold text-secondary-800 no-underline transition hover:border-primary-100 hover:bg-primary-50 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <Icon aria-hidden="true" className="h-4 w-4" />
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
