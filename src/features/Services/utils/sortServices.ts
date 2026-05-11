import type { Service, SortOption } from '../types/service';

const collator = new Intl.Collator('en', { sensitivity: 'base' });

export function sortServices(
	services: Service[],
	sortOption: SortOption
): Service[] {
	const sorted = [...services];

	switch (sortOption) {
		case 'oldest':
			return sorted.sort(
				(a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt)
			);
		case 'title-az':
			return sorted.sort((a, b) => collator.compare(a.title, b.title));
		case 'title-za':
			return sorted.sort((a, b) => collator.compare(b.title, a.title));
		case 'processing-time':
			return sorted.sort((a, b) => a.processingTime - b.processingTime);
		case 'fee-low':
			return sorted.sort((a, b) => a.fee - b.fee);
		case 'fee-high':
			return sorted.sort((a, b) => b.fee - a.fee);
		case 'newest':
		default:
			return sorted.sort(
				(a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
			);
	}
}
