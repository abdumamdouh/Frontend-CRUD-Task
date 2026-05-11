import { useTranslation } from 'react-i18next';
import type { SortOption } from '../types/service';
import { AppSelect } from '../../../components/common/design-system';

const sortOptions: SortOption[] = [
	'newest',
	'oldest',
	'title-az',
	'title-za',
	'processing-time',
	'fee-low',
	'fee-high',
];

interface SortSelectProps {
	value: SortOption;
	onChange: (value: SortOption) => void;
}

export function SortSelect({ value, onChange }: SortSelectProps) {
	const { t } = useTranslation();

	return (
		<AppSelect
			label={t('sort')}
			value={value}
			onChange={(nextValue) => onChange(nextValue as SortOption)}
			options={sortOptions.map((option) => ({
				value: option,
				label: t(`sortOptions.${option}`),
			}))}
		/>
	);
}
