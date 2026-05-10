declare module "@aegov/design-system-react" {
  import type {
    ButtonHTMLAttributes,
    InputHTMLAttributes,
    ReactElement,
    ReactNode,
    TextareaHTMLAttributes,
  } from "react";

  interface ButtonProps extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "style"
  > {
    children: ReactNode;
    className?: string;
    style?: "primary" | "secondary";
    variant?: "solid" | "soft" | "link" | "outline";
    size?: "xs" | "sm" | "base" | "lg";
    block?: boolean;
    isIcon?: boolean;
    asChild?: boolean;
    disabled?: boolean;
  }

  interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    prefix?: ReactNode;
    suffix?: ReactNode;
    size?: "sm" | "base" | "lg";
    variant?: "primary" | "secondary";
  }

  interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
    size?: "sm" | "base" | "lg";
    variant?: "primary" | "secondary";
  }

  interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
  }

  interface SelectProps {
    value?: string;
    onChange?: (value: string) => void;
    options: SelectOption[];
    label?: string;
    error?: string;
    helperText?: string;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    size?: "sm" | "base" | "lg";
    variant?: "primary" | "secondary";
    id?: string;
    className?: string;
  }

  interface CheckboxProps {
    checked?: boolean;
    defaultChecked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    disabled?: boolean;
    required?: boolean;
    name?: string;
    value?: string;
    id?: string;
    label?: string;
    description?: string;
    size?: "sm" | "base" | "lg";
    variant?: "primary" | "secondary";
    className?: string;
    asChild?: boolean;
  }

  interface CardProps {
    children: ReactNode;
    className?: string;
    variant?: "default" | "news" | "service" | "creative";
    size?: "sm" | "base" | "lg";
    bordered?: boolean;
    glow?: boolean;
    asChild?: boolean;
    noRadius?: boolean;
  }

  interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
    showFirstLast?: boolean;
  }

  interface TooltipProps {
    children: ReactNode;
    content: ReactNode;
    className?: string;
    side?: "top" | "right" | "bottom" | "left";
    align?: "start" | "center" | "end";
  }

  interface ToggleProps {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    disabled?: boolean;
    variant?: "default" | "success" | "mode" | "secondary";
    label?: string;
    className?: string;
    checkedIcon?: ReactNode;
    uncheckedIcon?: ReactNode;
    "aria-label"?: string;
  }

  interface ModalProps {
    children: ReactNode;
    title?: string;
    size?: "sm" | "md" | "lg";
    variant?: "default" | "danger";
    className?: string;
    trigger?: ReactNode;
    onEscapeKeyDown?: (event: Event) => void;
    onPointerDownOutside?: (event: Event) => void;
    onCloseAutoFocus?: (event: Event) => void;
  }

  interface ToastProps {
    children: ReactNode;
    duration?: number;
    showToast?: boolean;
  }

  interface BreadcrumbItem {
    label: string;
    href?: string;
    icon?: ReactNode;
  }

  interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    separator?: "slash" | "caret";
    showHomeIcon?: boolean;
    className?: string;
    linkComponent?: unknown;
  }

  export function Button(props: ButtonProps): ReactElement;
  export function Input(props: InputProps): ReactElement;
  export function Textarea(props: TextareaProps): ReactElement;
  export function Select(props: SelectProps): ReactElement;
  export function Checkbox(props: CheckboxProps): ReactElement;
  export function Card(props: CardProps): ReactElement;
  export function Pagination(props: PaginationProps): ReactElement | null;
  export function Tooltip(props: TooltipProps): ReactElement | null;
  export function Toggle(props: ToggleProps): ReactElement;
  export function Modal(props: ModalProps): ReactElement;
  export function Toast(props: ToastProps): ReactElement;
  export function Breadcrumbs(props: BreadcrumbsProps): ReactElement | null;
}
