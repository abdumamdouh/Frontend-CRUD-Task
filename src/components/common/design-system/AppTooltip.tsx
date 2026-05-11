import {
	useLayoutEffect,
	useRef,
	useState,
	type ComponentProps,
	type ReactNode,
} from 'react';
import { Tooltip } from '@aegov/design-system-react';

type AppTooltipProps = ComponentProps<typeof Tooltip>;
interface TruncatedTooltipProps extends Omit<AppTooltipProps, 'children'> {
	children: ReactNode;
	forceWhen?: boolean;
}

export function AppTooltip({
	side = 'top',
	align = 'center',
	className = '',
	...props
}: AppTooltipProps) {
	return (
		<Tooltip
			side={side}
			align={align}
			className={`max-w-xs leading-6 ${className}`}
			{...props}
		/>
	);
}

export function TruncatedTooltip({
	children,
	content,
	side = 'top',
	align = 'center',
	className = '',
	forceWhen = false,
}: TruncatedTooltipProps) {
	const contentRef = useRef<HTMLSpanElement>(null);
	const [isTruncated, setIsTruncated] = useState(false);

	useLayoutEffect(() => {
		const node = contentRef.current;
		if (!node) return undefined;
		const target = node.firstElementChild ?? node;

		const checkOverflow = () => {
			setIsTruncated(
				target.scrollWidth > target.clientWidth ||
					target.scrollHeight > target.clientHeight
			);
		};

		checkOverflow();
		const frame = window.requestAnimationFrame(checkOverflow);
		const shortDelay = window.setTimeout(checkOverflow, 80);
		const settledDelay = window.setTimeout(checkOverflow, 250);

		if (typeof ResizeObserver === 'undefined') return undefined;

		const resizeObserver = new ResizeObserver(checkOverflow);
		resizeObserver.observe(node);
		resizeObserver.observe(target);

		return () => {
			window.cancelAnimationFrame(frame);
			window.clearTimeout(shortDelay);
			window.clearTimeout(settledDelay);
			resizeObserver.disconnect();
		};
	}, [children, content]);

	const text = (
		<span
			ref={contentRef}
			className='block min-w-0'
		>
			{children}
		</span>
	);

	if (!forceWhen && !isTruncated) return text;

	return (
		<AppTooltip
			content={content}
			side={side}
			align={align}
			className={className}
		>
			{text}
		</AppTooltip>
	);
}
