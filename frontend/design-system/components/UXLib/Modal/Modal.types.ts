import type { ReactNode, CSSProperties } from "react";

export type ModalSize = 'small' | 'medium' | 'large';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    footer?: ReactNode;
    size?: ModalSize;
    className?: string; // For container
    overlayClassName?: string;
    style?: CSSProperties;
    id?: string;
    closeOnOverlayClick?: boolean;
    /** Show the header section with title and close button. Default: true */
    showHeader?: boolean;
    /** Show the footer section. Default: false, or true if footer is provided */
    showFooter?: boolean;
    /** Text for the confirm button when using default footer */
    confirmText?: string;
    /** Text for the cancel button when using default footer */
    cancelText?: string;
    /** Callback for confirm button in default footer */
    onConfirm?: () => void;
    /** Callback for cancel button in default footer */
    onCancel?: () => void;
}
