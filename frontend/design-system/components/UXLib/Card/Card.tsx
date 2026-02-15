"use client";
import type { CSSProperties } from "react";
import "../styles/cmpStyles.scss";
import type { CardProps } from "./Card.types";

export const Card = ({
    id,
    title,
    subtitle,
    children,
    footer,
    headerActions,
    variant = "elevated",
    size = "medium",
    className = "",
    style = {},
    onClick,
    clickable,
    media,
    mediaAlt = "",
}: CardProps) => {
    const isClickable = clickable ?? !!onClick;

    const cardStyle: CSSProperties = {
        ...style,
    };

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (onClick) {
            onClick(event);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (isClickable && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            onClick?.(event as unknown as React.MouseEvent<HTMLDivElement>);
        }
    };

    const renderMedia = () => {
        if (!media) return null;

        if (typeof media === "string") {
            return (
                <div className="card__media">
                    <img src={media} alt={mediaAlt} />
                </div>
            );
        }

        return <div className="card__media">{media}</div>;
    };

    const hasHeader = title || subtitle || headerActions;

    return (
        <div
            id={id}
            className={`card card--${variant} card--${size} ${isClickable ? "card--clickable" : ""} ${className}`}
            style={cardStyle}
            onClick={isClickable ? handleClick : undefined}
            onKeyDown={isClickable ? handleKeyDown : undefined}
            role={isClickable ? "button" : "article"}
            tabIndex={isClickable ? 0 : undefined}
            aria-label={id ? `card-${id}` : undefined}
        >
            {renderMedia()}

            {hasHeader && (
                <div className="card__header">
                    <div className="card__header-text">
                        {title && <h3 className="card__title">{title}</h3>}
                        {subtitle && <p className="card__subtitle">{subtitle}</p>}
                    </div>
                    {headerActions && (
                        <div className="card__header-actions">{headerActions}</div>
                    )}
                </div>
            )}

            {children && <div className="card__content">{children}</div>}

            {footer && <div className="card__footer">{footer}</div>}
        </div>
    );
};
