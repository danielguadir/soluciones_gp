import type { ModalProps } from "../Modal/Modal.types";

export interface FeedbackModalProps extends Omit<ModalProps, 'children' | 'title'> {
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    title?: string;
    description?: string;
}
