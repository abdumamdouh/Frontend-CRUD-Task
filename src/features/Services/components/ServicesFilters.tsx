import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { categories, statuses, tags } from '../constants/serviceOptions';
import type {
	ServiceCategory,
	ServiceFilters,
	ServiceStatus,
	ServiceTag,
} from '../types/service';
import {
	translateCategory,
	translateStatus,
} from '../utils/serviceTranslations';
import {
	AppCheckbox,
	AppSelect,
} from '../../../components/common/design-system';
import { TagsFilterModal } from './TagsFilterModal';

interface ServicesFiltersProps {
	filters: Omit<ServiceFilters, 'searchTerm'>;
	onChange: (patch: Partial<Omit<ServiceFilters, 'searchTerm'>>) => void;
}

function ServicesFiltersComponent({ filters, onChange }: ServicesFiltersProps) {
	const { t, i18n } = useTranslation();

	const selectedCategory = filters.category || 'all';

	const categoryOptions = useMemo(
		() => [
			{ value: 'all', label: t('allCategories') },
			...categories.map((category) => ({
				value: category,
				label: translateCategory(category, i18n.language),
			})),
		],
		[i18n.language, t]
	);

	const toggleStatus = useCallback(
		(status: ServiceStatus) => {
			const nextStatuses = filters.statuses.includes(status)
				? filters.statuses.filter((item) => item !== status)
				: [...filters.statuses, status];
			onChange({ statuses: nextStatuses });
		},
		[filters.statuses, onChange]
	);

	const handleCategoryChange = useCallback(
		(value: string) => {
			onChange({
				category: value === 'all' ? '' : (value as ServiceCategory),
			});
		},
		[onChange]
	);

	const handlePopularChange = useCallback(
		(checked: boolean) => onChange({ popularOnly: checked }),
		[onChange]
	);

	const handleApplyTags = useCallback(
		(nextTags: ServiceTag[]) => onChange({ tags: nextTags }),
		[onChange]
	);

	const handleClearTags = useCallback(() => onChange({ tags: [] }), [onChange]);

	const statusOptionsElement = (
		<div className='flex flex-wrap gap-3'>
			{statuses.map((status) => (
				<AppCheckbox
					key={status}
					checked={filters.statuses.includes(status)}
					onCheckedChange={() => toggleStatus(status)}
					label={translateStatus(status, i18n.language)}
				/>
			))}

			<AppCheckbox
				checked={filters.popularOnly}
				onCheckedChange={handlePopularChange}
				label={t('popularOnly')}
			/>
		</div>
	);

	return (
		<div className='grid gap-6'>
			<div className='grid gap-4 md:grid-cols-2'>
				<AppSelect
					label={t('category')}
					value={selectedCategory}
					onChange={handleCategoryChange}
					options={categoryOptions}
				/>

				<fieldset>
					<legend className='mb-2 text-sm font-semibold text-slate-700'>
						{t('status')}
					</legend>

					{statusOptionsElement}
				</fieldset>
			</div>

			<TagsFilterModal
				allTags={tags}
				selectedTags={filters.tags}
				onApplyTags={handleApplyTags}
				onClearTags={handleClearTags}
			/>
		</div>
	);
}

export const ServicesFilters = memo(ServicesFiltersComponent);
