import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../components/common/toastContext';
import { useQuery } from '../../../hooks/useQuery';
import { servicesApi } from '../services/services.service';
import type { Service } from '../types/service';
import { getLocalizedService } from '../utils/serviceTranslations';

export function useFavoriteServices() {
	const { t, i18n } = useTranslation();
	const { showToast } = useToast();

	const [favoriteBusyId, setFavoriteBusyId] = useState<string | null>(null);

	const {
		data: services,
		isLoading,
		error,
		refetch,
		setData,
	} = useQuery<Service[]>({
		queryFn: servicesApi.getServices,
		initialData: [],
	});

	const favoriteServices = useMemo(
		() => services.filter((service) => service.isFavorite),
		[services]
	);

	const handleToggleFavorite = useCallback(
		async (id: string) => {
			const feedbackKey = 'feedback.favoriteRemoved';

			setFavoriteBusyId(id);

			try {
				const nextServices = await servicesApi.toggleFavorite(id);
				setData(nextServices);
				showToast(t(feedbackKey));
			} catch {
				showToast(t('feedback.failed'), 'error');
			} finally {
				setFavoriteBusyId(null);
			}
		},
		[setData, showToast, t]
	);

	const handleStartService = useCallback(
		(service: Service) => {
			const serviceTitle = getLocalizedService(service, i18n.language).title;
			showToast(t('feedback.started', { title: serviceTitle }));
		},
		[i18n.language, showToast, t]
	);

	return {
		error,
		favoriteBusyId,
		favoriteServices,
		handleStartService,
		handleToggleFavorite,
		isLoading,
		refetch,
		t,
	};
}
