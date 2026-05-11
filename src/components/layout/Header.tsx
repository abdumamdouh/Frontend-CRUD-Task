import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BookOpenText } from '@phosphor-icons/react';
import { appTheme } from '../../config/theme';
import {
	AppButton,
	AppToggle,
	AppTooltip,
} from '../common/design-system';
import { LanguageSelect } from './LanguageSelect';
import { Navigation } from './Navigation';
import { ProjectDrawer } from './ProjectDrawer';

type AppColorMode = 'light' | 'dark';

const getInitialColorMode = (): AppColorMode => {
	const savedTheme = localStorage.getItem(appTheme.storageKeys.theme);
	if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
	return 'light';
};

export function Header() {
	const { t, i18n } = useTranslation();

	const [colorMode, setColorMode] = useState<AppColorMode>(getInitialColorMode);
	const [isProjectDrawerOpen, setIsProjectDrawerOpen] = useState(false);

	useEffect(() => {
		document.documentElement.lang = i18n.language;
		document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
		localStorage.setItem(appTheme.storageKeys.language, i18n.language);
	}, [i18n.language]);

	useEffect(() => {
		document.documentElement.dataset.theme = colorMode;
		localStorage.setItem(appTheme.storageKeys.theme, colorMode);
	}, [colorMode]);

	const setDarkMode = (isDark: boolean) =>
		setColorMode(isDark ? 'dark' : 'light');

	const openProjectDrawer = () => setIsProjectDrawerOpen(true);
	const closeProjectDrawer = () => setIsProjectDrawerOpen(false);
	const handleLanguageChange = (value: string) => i18n.changeLanguage(value);

	return (
		<header className='sticky top-0 z-40 border-b border-primary-100 bg-whitely-50/95 backdrop-blur'>
			<div className='absolute right-4 top-3 z-10'>
				<AppTooltip
					content={colorMode === 'dark' ? t('lightMode') : t('darkMode')}
				>
					<AppToggle
						variant='mode'
						checked={colorMode === 'dark'}
						onCheckedChange={setDarkMode}
						label={t('toggleTheme')}
						className='app-theme-toggle'
					/>
				</AppTooltip>
			</div>

			<div className='mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 pe-20 sm:px-6 sm:pe-20 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:pe-20'>
				<Link
					to='/'
					className='block rounded-md no-underline outline-none focus-visible:ring-2 focus-visible:ring-primary-500'
					aria-label={t('goHome')}
				>
					<h1 className='text-2xl font-bold text-aeblack-800'>
						{t('appName')}
					</h1>
				</Link>

				<div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
					<Navigation />

					<AppButton
						variant='secondary'
						className='h-10'
						onClick={openProjectDrawer}
					>
						<span className='inline-flex items-center gap-2'>
							<BookOpenText
								aria-hidden='true'
								className='h-4 w-4'
							/>
							{t('projectOverview')}
						</span>
					</AppButton>

					<LanguageSelect
						value={i18n.language}
						onChange={handleLanguageChange}
					/>
				</div>
			</div>

			<ProjectDrawer
				isOpen={isProjectDrawerOpen}
				onClose={closeProjectDrawer}
			/>
		</header>
	);
}
