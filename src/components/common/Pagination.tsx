import {
  CaretDoubleLeft,
  CaretDoubleRight,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import { AppButton } from "./design-system";

interface PaginationProps {
  currentPage: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

const getPages = (currentPage: number, pageCount: number) => {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  if (currentPage <= 3) return [1, 2, 3, 4, 5, "...", pageCount] as const;
  if (currentPage >= pageCount - 2) {
    return [
      1,
      "...",
      pageCount - 4,
      pageCount - 3,
      pageCount - 2,
      pageCount - 1,
      pageCount,
    ] as const;
  }

  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    pageCount,
  ] as const;
};

const paginationIconClass = "h-5 w-5";

export function Pagination({
  currentPage,
  pageCount,
  onPageChange,
}: PaginationProps) {
  const { i18n, t } = useTranslation();

  if (pageCount <= 1) return null;

  const pages = getPages(currentPage, pageCount);
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === pageCount;
  const isRtl = i18n.language.startsWith("ar");
  const FirstIcon = isRtl ? CaretDoubleRight : CaretDoubleLeft;
  const PreviousIcon = isRtl ? CaretRight : CaretLeft;
  const NextIcon = isRtl ? CaretLeft : CaretRight;
  const LastIcon = isRtl ? CaretDoubleLeft : CaretDoubleRight;

  return (
    <nav
      className="app-pagination motion-page mt-8"
      aria-label={t("pagination")}
    >
      <div className="flex items-center gap-1 sm:hidden">
        <AppButton
          variant="ghost"
          disabled={isFirstPage}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <PreviousIcon aria-hidden="true" className={paginationIconClass} />
          <span>{t("previous")}</span>
        </AppButton>
        <span className="px-3 text-sm text-slate-600">
          {t("pageOf", { page: currentPage, total: pageCount })}
        </span>
        <AppButton
          variant="ghost"
          disabled={isLastPage}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <span>{t("next")}</span>
          <NextIcon aria-hidden="true" className={paginationIconClass} />
        </AppButton>
      </div>

      <div className="hidden items-center gap-1 sm:flex">
        <AppButton
          variant="ghost"
          disabled={isFirstPage}
          onClick={() => onPageChange(1)}
          aria-label={t("firstPage")}
        >
          <FirstIcon aria-hidden="true" className={paginationIconClass} />
          <span className="hidden lg:inline">{t("first")}</span>
        </AppButton>
        <AppButton
          variant="ghost"
          disabled={isFirstPage}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label={t("previousPage")}
        >
          <PreviousIcon aria-hidden="true" className={paginationIconClass} />
          <span className="hidden lg:inline">{t("previous")}</span>
        </AppButton>

        <div className="flex items-center gap-1">
          {pages.map((page, index) =>
            page === "..." ? (
              <span
                key={`ellipsis-${index}`}
                className="px-2 text-slate-400"
                aria-hidden="true"
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                type="button"
                className={`inline-flex h-10 min-w-10 items-center justify-center rounded-lg px-3 text-sm font-semibold transition ${
                  currentPage === page
                    ? "bg-primary-600 text-whitely-50"
                    : "text-slate-700 hover:bg-primary-50 hover:text-primary-700"
                }`}
                aria-current={currentPage === page ? "page" : undefined}
                aria-label={t("goToPage", { page })}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            ),
          )}
        </div>

        <AppButton
          variant="ghost"
          disabled={isLastPage}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label={t("nextPage")}
        >
          <span className="hidden lg:inline">{t("next")}</span>
          <NextIcon aria-hidden="true" className={paginationIconClass} />
        </AppButton>
        <AppButton
          variant="ghost"
          disabled={isLastPage}
          onClick={() => onPageChange(pageCount)}
          aria-label={t("lastPage")}
        >
          <span className="hidden lg:inline">{t("last")}</span>
          <LastIcon aria-hidden="true" className={paginationIconClass} />
        </AppButton>
      </div>
    </nav>
  );
}
