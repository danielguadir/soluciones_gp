import React from 'react';
import { Modal } from '../Modal/Modal';
import { Svg } from '../Svg/Svg';
import type { FeedbackModalProps } from './FeedbackModal.types';
import './FeedbackModal.scss';

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
    type,
    message,
    title,
    description,
    isOpen,
    onClose,
    onConfirm,
    confirmText = "Aceptar",
    ...props
}) => {
    const getIconConfig = () => {
        switch (type) {
            case 'success':
                return { icon: 'check', color: '#047857', defaultTitle: '¡Éxito!' };
            case 'error':
                return { icon: 'cancel', color: '#d32f2f', defaultTitle: 'Ha ocurrido un error' };
            case 'warning':
                return { icon: 'attention', color: '#f57c00', defaultTitle: 'Atención' };
            default:
                return { icon: 'info-circled', color: '#0284c7', defaultTitle: 'Información' };
        }
    };

    const { icon, color, defaultTitle } = getIconConfig();

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={onConfirm || onClose}
            confirmText={confirmText}
            showHeader={false}
            showFooter={true}
            size="small"
            className={`feedback-modal feedback-modal--${type}`}
            {...props}
        >
            <div className="feedback-modal__body">
                <div className="feedback-modal__icon-container" style={{ backgroundColor: `${color}15` }}>
                    <Svg icon={icon} color={color} fontSize="3rem" />
                </div>

                <div className="feedback-modal__text">
                    <h3 className="feedback-modal__title">{title || defaultTitle}</h3>
                    <p className="feedback-modal__message">{message}</p>
                    {description && <p className="feedback-modal__description">{description}</p>}
                </div>
            </div>
        </Modal>
    );
};
