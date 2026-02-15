import type { CSSProperties } from "react";
import "../styles/cmpStyles.scss";
import type { DividerProps } from "./Divider.types";

export const Divider = ({
    id,
    orientation = "horizontal",
    variant = "solid",
    color,
    thickness,
    spacing,
    label,
    labelPosition = "center",
    className = "",
    style = {},
}: DividerProps) => {
    const dividerStyle: CSSProperties = {
        ...(color ? { "--divider-color": color } as CSSProperties : {}),
        ...(thickness ? { "--divider-thickness": thickness } as CSSProperties : {}),
        ...(spacing ? { "--divider-spacing": spacing } as CSSProperties : {}),
        ...style,
    };

    const hasLabel = label && orientation === "horizontal";

    if (hasLabel) {
        return (
            <div
                id={id}
                className={`divider divider--${orientation} divider--${variant} divider--with-label divider--label-${labelPosition} ${className}`}
                style={dividerStyle}
                role="separator"
                aria-orientation={orientation}
            >
                <span className="divider__line" />
                <span className="divider__label">{label}</span>
                <span className="divider__line" />
            </div>
        );
    }

    return (
        <hr
            id={id}
            className={`divider divider--${orientation} divider--${variant} ${className}`}
            style={dividerStyle}
            role="separator"
            aria-orientation={orientation}
        />
    );
};
