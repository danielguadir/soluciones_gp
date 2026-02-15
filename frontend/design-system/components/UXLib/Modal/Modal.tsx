import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import type { ModalProps } from "./Modal.types";
import { Svg } from "../Svg/Svg";
import { Button } from "../Button/Button";

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'medium',
    className = "",
    overlayClassName = "",
    style = {},
    id,
    closeOnOverlayClick = true,
    showHeader = true,
    showFooter,
    confirmText = "Aceptar",
    cancelText = "Cancelar",
    onConfirm,
    onCancel
}) => {
    const overlayRef = useRef<HTMLDivElement>(null);

    // Determine if footer should be shown
    const shouldShowFooter = showFooter ?? (footer !== undefined || onConfirm !== undefined || onCancel !== undefined);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (closeOnOverlayClick && e.target === overlayRef.current) {
            onClose();
        }
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            onClose();
        }
    };

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
    };

    // Render footer content
    const renderFooter = () => {
        if (footer) {
            return footer;
        }

        // Default footer with Cancel/Confirm buttons
        return (
            <>
                <Button
                    nameBtn={cancelText}
                    variant="text"
                    onClick={handleCancel}
                />
                {onConfirm && (
                    <Button
                        nameBtn={confirmText}
                        variant="contained"
                        onClick={handleConfirm}
                    />
                )}
            </>
        );
    };

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div
            className={`modal-overlay ${overlayClassName}`}
            ref={overlayRef}
            onClick={handleOverlayClick}
            data-testid="modal-overlay"
        >
            <div
                id={id}
                className={`modal__container modal__container--${size} ${className}`}
                style={style}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? "modal-title" : undefined}
            >
                {showHeader && (
                    <div className="modal__header">
                        {title && <h3 id="modal-title">{title}</h3>}
                        <button
                            className="close-btn"
                            onClick={onClose}
                            aria-label="Close modal"
                            data-testid="modal-close-btn"
                        >
                            <Svg icon="cancel" fontSize="1.2rem" />
                        </button>
                    </div>
                )}
                <div className="modal__content">
                    {children}
                </div>
                {shouldShowFooter && (
                    <div className="modal__footer">
                        {renderFooter()}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};
