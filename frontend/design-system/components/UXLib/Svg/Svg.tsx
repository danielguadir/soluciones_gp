import type { CSSProperties, KeyboardEvent } from "react";
import type { SvgProps } from "./Svg.types";
import "./fontello/css/fontello.css";

/**
 * Svg Icon Component
 * 
 * @component
 * @example
 * <Svg 
 *   icon="plus" 
 *   fontSize="32px" 
 *   color="#d57611" 
 *   onClick={handleClick}
 *   title="Add item"
 * />
 */
export const Svg = ({
    id,
    onClick,
    icon,
    fontSize,
    color,
    style = {},
    className = "",
    title = "",
    cursor = "default",
    role,
    ariaLabel
}: SvgProps) => {
    const isInteractive = !!onClick;

    const iconStyle: CSSProperties = {
        fontSize: fontSize,
        color: color,
        cursor: isInteractive ? 'pointer' : cursor,
        ...style,
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
        if (isInteractive && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            onClick?.(event as unknown as React.MouseEvent<HTMLElement>);
        }
    };

    // Determine accessibility attributes
    const computedRole = role || (isInteractive ? 'button' : 'img');
    const computedTabIndex = isInteractive ? 0 : undefined;
    const computedAriaLabel = ariaLabel || title || undefined;
    // Hide from screen readers if it's purely decorative (no label/title and not interactive)
    const ariaHidden = !computedAriaLabel && !isInteractive;

    return (
        <i
            id={id}
            onClick={onClick}
            onKeyDown={handleKeyDown}
            className={`icon-${icon} ${className}`}
            title={title}
            style={iconStyle}
            role={computedRole}
            tabIndex={computedTabIndex}
            aria-label={computedAriaLabel}
            aria-hidden={ariaHidden}
        />
    );
};
