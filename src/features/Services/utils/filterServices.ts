import type { Service, ServiceFilters } from '../types/service';
import { getLocalizedService } from './serviceTranslations';

const normalizeSearchText = (value: string) =>
	value
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[إأآا]/g, 'ا')
		.replace(/ى/g, 'ي')
		.replace(/ة/g, 'ه')
		.replace(/ـ/g, '')
		.trim();

const includesText = (value: string, searchTerm: string) =>
	normalizeSearchText(value).includes(searchTerm);

export function filterServices(
	services: Service[],
	filters: ServiceFilters,
	language = 'en'
): Service[] {
	const searchTerm = normalizeSearchText(filters.searchTerm);

	return services.filter((service) => {
		const localizedService = getLocalizedService(service, language);

		const matchesSearch =
			!searchTerm ||
			includesText(service.title, searchTerm) ||
			includesText(service.description, searchTerm) ||
			includesText(service.category, searchTerm) ||
			service.tags.some((tag) => includesText(tag, searchTerm)) ||
			includesText(localizedService.title, searchTerm) ||
			includesText(localizedService.description, searchTerm) ||
			includesText(localizedService.category, searchTerm) ||
			localizedService.tags.some((tag) => includesText(tag, searchTerm));

		const matchesCategory =
			!filters.category || service.category === filters.category;

		const matchesStatus =
			filters.statuses.length === 0 ||
			filters.statuses.includes(service.status);

		const matchesTags =
			filters.tags.length === 0 ||
			filters.tags.every((tag) => service.tags.includes(tag));

		const matchesPopular = !filters.popularOnly || service.isPopular;

		return (
			matchesSearch &&
			matchesCategory &&
			matchesStatus &&
			matchesTags &&
			matchesPopular
		);
	});
}
