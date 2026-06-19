import {
  isValidElement,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  Arrow,
  Content,
  Portal,
  Root,
  Trigger,
} from "@radix-ui/react-tooltip";
import { getClientExtensionPortalContainer } from "../../../utils/portalContainer";

export interface AppTooltipProps {
  children: ReactNode;
  content: ReactNode;
  className?: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}

const contentClassName = "app-tooltip-content";

function TooltipTrigger({ children }: { children: ReactNode }) {
  if (isValidElement(children)) {
    return <Trigger asChild>{children}</Trigger>;
  }

  return (
    <Trigger asChild>
      <span className="inline-flex min-w-0 items-center gap-1">{children}</span>
    </Trigger>
  );
}

export function AppTooltip({
  children,
  content,
  side = "top",
  align = "center",
  className = "",
}: AppTooltipProps) {
  const mergedClassName = `${contentClassName} ${className}`.trim();

  return (
    <Root>
      <TooltipTrigger>{children}</TooltipTrigger>
      <Portal container={getClientExtensionPortalContainer()}>
        <Content
          side={side}
          align={align}
          sideOffset={4}
          className={mergedClassName}
        >
          {content}
          <Arrow className="app-tooltip-arrow" />
        </Content>
      </Portal>
    </Root>
  );
}

interface TruncatedTooltipProps extends Omit<AppTooltipProps, "children"> {
  children: ReactNode;
  forceWhen?: boolean;
}

export function TruncatedTooltip({
  children,
  content,
  side = "top",
  align = "center",
  className = "",
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
          target.scrollHeight > target.clientHeight,
      );
    };

    checkOverflow();
    const frame = window.requestAnimationFrame(checkOverflow);
    const shortDelay = window.setTimeout(checkOverflow, 80);
    const settledDelay = window.setTimeout(checkOverflow, 250);

    if (typeof ResizeObserver === "undefined") return undefined;

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
    <span ref={contentRef} className="block min-w-0">
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
