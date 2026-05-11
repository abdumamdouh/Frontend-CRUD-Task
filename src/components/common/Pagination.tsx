import {
	CaretDoubleLeft,
	CaretDoubleRight,
	CaretLeft,
	CaretRight,
} from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { AppButton } from './design-system';

interface PaginationProps {
	currentPage: number;
	pageCount: number;
	onPageChange: (page: number) => void;
}

type PageItem = number | '...';

const getPages = (currentPage: number, pageCount: number) => {
	if (pageCount <= 7) {
		return Array.from({ length: pageCount }, (_, index) => index + 1);
	}

	if (currentPage <= 3) return [1, 2, 3, 4, 5, '...', pageCount] as const;
	if (currentPage >= pageCount - 2) {
		return [
			1,
			'...',
			pageCount - 4,
			pageCount - 3,
			pageCount - 2,
			pageCount - 1,
			pageCount,
		] as const;
	}

	return [
		1,
		'...',
		currentPage - 1,
		currentPage,
		currentPage + 1,
		'...',
		pageCount,
	] as const;
};

const paginationIconClass = 'h-5 w-5';

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
	const isRtl = i18n.language.startsWith('ar');
	const FirstIcon = isRtl ? CaretDoubleRight : CaretDoubleLeft;
	const PreviousIcon = isRtl ? CaretRight : CaretLeft;
	const NextIcon = isRtl ? CaretLeft : CaretRight;
	const LastIcon = isRtl ? CaretDoubleLeft : CaretDoubleRight;

	return (
		<nav
			className='app-pagination motion-page mt-8'
			aria-label={t('pagination')}
		>
			<MobilePaginationControls
				currentPage={currentPage}
				isFirstPage={isFirstPage}
				isLastPage={isLastPage}
				onPageChange={onPageChange}
				previousLabel={t('previous')}
				nextLabel={t('next')}
				pageOfLabel={t('pageOf', { page: currentPage, total: pageCount })}
				previousIcon={
					<PreviousIcon
						aria-hidden='true'
						className={paginationIconClass}
					/>
				}
				nextIcon={
					<NextIcon
						aria-hidden='true'
						className={paginationIconClass}
					/>
				}
			/>

			<DesktopPaginationControls
				currentPage={currentPage}
				pageCount={pageCount}
				pages={pages}
				isFirstPage={isFirstPage}
				isLastPage={isLastPage}
				onPageChange={onPageChange}
				firstLabel={t('first')}
				previousLabel={t('previous')}
				nextLabel={t('next')}
				lastLabel={t('last')}
				firstPageAriaLabel={t('firstPage')}
				previousPageAriaLabel={t('previousPage')}
				nextPageAriaLabel={t('nextPage')}
				lastPageAriaLabel={t('lastPage')}
				getGoToPageAriaLabel={(page) => t('goToPage', { page })}
				firstIcon={
					<FirstIcon
						aria-hidden='true'
						className={paginationIconClass}
					/>
				}
				previousIcon={
					<PreviousIcon
						aria-hidden='true'
						className={paginationIconClass}
					/>
				}
				nextIcon={
					<NextIcon
						aria-hidden='true'
						className={paginationIconClass}
					/>
				}
				lastIcon={
					<LastIcon
						aria-hidden='true'
						className={paginationIconClass}
					/>
				}
			/>
		</nav>
	);
}

interface MobilePaginationControlsProps {
	currentPage: number;
	isFirstPage: boolean;
	isLastPage: boolean;
	onPageChange: (page: number) => void;
	previousLabel: string;
	nextLabel: string;
	pageOfLabel: string;
	previousIcon: ReactNode;
	nextIcon: ReactNode;
}

function MobilePaginationControls({
	currentPage,
	isFirstPage,
	isLastPage,
	onPageChange,
	previousLabel,
	nextLabel,
	pageOfLabel,
	previousIcon,
	nextIcon,
}: MobilePaginationControlsProps) {
	return (
		<div className='flex items-center gap-1 sm:hidden'>
			<AppButton
				variant='ghost'
				disabled={isFirstPage}
				onClick={() => onPageChange(currentPage - 1)}
			>
				{previousIcon}
				<span>{previousLabel}</span>
			</AppButton>

			<span className='px-3 text-sm text-slate-600'>{pageOfLabel}</span>

			<AppButton
				variant='ghost'
				disabled={isLastPage}
				onClick={() => onPageChange(currentPage + 1)}
			>
				<span>{nextLabel}</span>
				{nextIcon}
			</AppButton>
		</div>
	);
}

interface DesktopPaginationControlsProps {
	currentPage: number;
	pageCount: number;
	pages: readonly PageItem[];
	isFirstPage: boolean;
	isLastPage: boolean;
	onPageChange: (page: number) => void;
	firstLabel: string;
	previousLabel: string;
	nextLabel: string;
	lastLabel: string;
	firstPageAriaLabel: string;
	previousPageAriaLabel: string;
	nextPageAriaLabel: string;
	lastPageAriaLabel: string;
	getGoToPageAriaLabel: (page: number) => string;
	firstIcon: ReactNode;
	previousIcon: ReactNode;
	nextIcon: ReactNode;
	lastIcon: ReactNode;
}

function DesktopPaginationControls({
	currentPage,
	pageCount,
	pages,
	isFirstPage,
	isLastPage,
	onPageChange,
	firstLabel,
	previousLabel,
	nextLabel,
	lastLabel,
	firstPageAriaLabel,
	previousPageAriaLabel,
	nextPageAriaLabel,
	lastPageAriaLabel,
	getGoToPageAriaLabel,
	firstIcon,
	previousIcon,
	nextIcon,
	lastIcon,
}: DesktopPaginationControlsProps) {
	return (
		<div className='hidden items-center gap-1 sm:flex'>
			<PaginationNavButton
				disabled={isFirstPage}
				onClick={() => onPageChange(1)}
				ariaLabel={firstPageAriaLabel}
				label={firstLabel}
				icon={firstIcon}
			/>

			<PaginationNavButton
				disabled={isFirstPage}
				onClick={() => onPageChange(currentPage - 1)}
				ariaLabel={previousPageAriaLabel}
				label={previousLabel}
				icon={previousIcon}
			/>

			<div className='flex items-center gap-1'>
				{pages.map((page, index) =>
					page === '...' ? (
						<PaginationEllipsis key={`ellipsis-${index}`} />
					) : (
						<PaginationPageButton
							key={page}
							page={page}
							isActive={currentPage === page}
							onClick={() => onPageChange(page)}
							ariaLabel={getGoToPageAriaLabel(page)}
						/>
					)
				)}
			</div>

			<PaginationNavButton
				disabled={isLastPage}
				onClick={() => onPageChange(currentPage + 1)}
				ariaLabel={nextPageAriaLabel}
				label={nextLabel}
				icon={nextIcon}
				labelFirst
			/>

			<PaginationNavButton
				disabled={isLastPage}
				onClick={() => onPageChange(pageCount)}
				ariaLabel={lastPageAriaLabel}
				label={lastLabel}
				icon={lastIcon}
				labelFirst
			/>
		</div>
	);
}

interface PaginationNavButtonProps {
	disabled: boolean;
	onClick: () => void;
	ariaLabel: string;
	label: string;
	icon: ReactNode;
	labelFirst?: boolean;
}

function PaginationNavButton({
	disabled,
	onClick,
	ariaLabel,
	label,
	icon,
	labelFirst = false,
}: PaginationNavButtonProps) {
	return (
		<AppButton
			variant='ghost'
			disabled={disabled}
			onClick={onClick}
			aria-label={ariaLabel}
		>
			{labelFirst && <span className='hidden lg:inline'>{label}</span>}
			{icon}
			{!labelFirst && <span className='hidden lg:inline'>{label}</span>}
		</AppButton>
	);
}

interface PaginationPageButtonProps {
	page: number;
	isActive: boolean;
	onClick: () => void;
	ariaLabel: string;
}

function PaginationPageButton({
	page,
	isActive,
	onClick,
	ariaLabel,
}: PaginationPageButtonProps) {
	return (
		<button
			type='button'
			className={`inline-flex h-10 min-w-10 items-center justify-center rounded-lg px-3 text-sm font-semibold transition ${
				isActive
					? 'bg-primary-600 text-whitely-50'
					: 'text-slate-700 hover:bg-primary-50 hover:text-primary-700'
			}`}
			aria-current={isActive ? 'page' : undefined}
			aria-label={ariaLabel}
			onClick={onClick}
		>
			{page}
		</button>
	);
}

function PaginationEllipsis() {
	return (
		<span
			className='px-2 text-slate-400'
			aria-hidden='true'
		>
			...
		</span>
	);
}
