import type { ComponentProps } from 'react';
import { Toggle } from '@aegov/design-system-react';
import { Moon, Sun } from '@phosphor-icons/react';

type AppToggleProps = ComponentProps<typeof Toggle>;

export function AppToggle({
	variant = 'default',
	className = '',
	checkedIcon,
	uncheckedIcon,
	...props
}: AppToggleProps) {
	const isModeToggle = variant === 'mode';

	return (
		<Toggle
			variant={variant}
			checkedIcon={
				checkedIcon ??
				(isModeToggle ? (
					<Moon
						weight='fill'
						aria-hidden='true'
						className='h-3.5 w-3.5'
					/>
				) : undefined)
			}
			uncheckedIcon={
				uncheckedIcon ??
				(isModeToggle ? (
					<Sun
						weight='fill'
						aria-hidden='true'
						className='h-3.5 w-3.5'
					/>
				) : undefined)
			}
			className={`rounded-full ${className}`}
			{...props}
		/>
	);
}
