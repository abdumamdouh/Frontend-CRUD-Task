import type { ComponentProps } from 'react';
import { Select } from '@aegov/design-system-react';

type AppSelectProps = ComponentProps<typeof Select>;

export function AppSelect({
	variant = 'secondary',
	className = '',
	...props
}: AppSelectProps) {
	return (
		<Select
			variant={variant}
			className={`app-select ${className}`}
			{...props}
		/>
	);
}
