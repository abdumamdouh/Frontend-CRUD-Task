import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../../../components/common/toastContext';
import { useQuery } from '../../../hooks/useQuery';
import { servicesApi } from '../services/services.service';
import type { Service } from '../types/service';
import { getLocalizedService } from '../utils/serviceTranslations';

export function useServiceDetails() {
	const { t, i18n } = useTranslation();
	const { serviceId } = useParams();
	const { showToast } = useToast();

	const navigate = useNavigate();

	const [favoriteBusy, setFavoriteBusy] = useState(false);

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

	const service = useMemo(
		() => services.find((item) => item.id === serviceId),
		[serviceId, services]
	);

	const localizedService = useMemo(
		() => (service ? getLocalizedService(service, i18n.language) : null),
		[i18n.language, service]
	);

	const handleToggleFavorite = useCallback(async () => {
		if (!service) return;

		const feedbackKey = service.isFavorite
			? 'feedback.favoriteRemoved'
			: 'feedback.favoriteAdded';

		setFavoriteBusy(true);

		try {
			const nextServices = await servicesApi.toggleFavorite(service.id);
			setData(nextServices);
			showToast(t(feedbackKey));
		} catch {
			showToast(t('feedback.failed'), 'error');
		} finally {
			setFavoriteBusy(false);
		}
	}, [service, setData, showToast, t]);

	const goBackToServices = useCallback(() => {
		navigate('/');
	}, [navigate]);

	const handleStartService = useCallback(() => {
		if (!service || !localizedService) return;

		showToast(t('feedback.started', { title: localizedService.title }));
	}, [localizedService, service, showToast, t]);

	return {
		error,
		favoriteBusy,
		goBackToServices,
		handleStartService,
		handleToggleFavorite,
		i18n,
		isLoading,
		localizedService,
		refetch,
		service,
		t,
	};
}
