import { X } from '@phosphor-icons/react';
import {
	Close,
	Content,
	Description,
	Overlay,
	Portal,
	Root,
	Title,
} from '@radix-ui/react-dialog';
import { useTranslation } from 'react-i18next';
import readmeContent from '../../../README.md?raw';
import { MarkdownContent } from '../common/MarkdownContent';

interface ProjectDrawerProps {
	isOpen: boolean;
	onClose: () => void;
}

const overlayClassName =
	'fixed inset-0 z-50 bg-aeblack-950/45 backdrop-blur-sm data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0';

const contentClassName =
	'app-drawer-content fixed inset-y-0 end-0 z-50 flex w-full max-w-2xl flex-col border-s border-slate-200 bg-white shadow-2xl outline-none data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:animate-in data-[state=open]:slide-in-from-right sm:w-[min(42rem,92vw)]';

export function ProjectDrawer({ isOpen, onClose }: ProjectDrawerProps) {
	const { t } = useTranslation();
	const projectOverviewLabel = t('projectOverview');

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			onClose();
		}
	};

	return (
		<Root
			open={isOpen}
			onOpenChange={handleOpenChange}
		>
			<Portal>
				<Overlay className={overlayClassName} />

				<Content
					className={contentClassName}
					onOpenAutoFocus={(event) => event.preventDefault()}
				>
					<div className='flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4'>
						<Title className='text-xl font-bold text-aeblack-900'>
							{projectOverviewLabel}
						</Title>
						<Description className='sr-only'>
							{projectOverviewLabel}
						</Description>

						<Close
							className='inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400'
							aria-label={t('close')}
						>
							<X
								aria-hidden='true'
								className='h-5 w-5'
							/>
						</Close>
					</div>

					<div className='min-h-0 flex-1 overflow-y-auto px-5 py-5'>
						<MarkdownContent content={readmeContent} />
					</div>
				</Content>
			</Portal>
		</Root>
	);
}
