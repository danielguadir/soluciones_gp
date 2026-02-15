import type { CSSProperties } from "react";
import type { ProgressProps } from "./Progress.types";

export const Progress = ({
    id,
    value,
    variant = "linear",
    size = "medium",
    color,
    trackColor,
    showLabel = false,
    label,
    indeterminate = false,
    thickness,
    className = "",
    style = {},
}: ProgressProps) => {
    // Clamp value between 0 and 100
    const normalizedValue = Math.min(100, Math.max(0, value));

    const progressStyle: CSSProperties = {
        ...(color ? { "--progress-color": color } as CSSProperties : {}),
        ...(trackColor ? { "--progress-track-color": trackColor } as CSSProperties : {}),
        ...(thickness ? { "--progress-thickness": thickness } as CSSProperties : {}),
        ...style,
    };

    const renderLabel = () => {
        if (label) return label;
        if (showLabel) return `${Math.round(normalizedValue)}%`;
        return null;
    };

    if (variant === "circular") {
        // Calculate SVG parameters for circular progress
        const getSvgSize = () => {
            switch (size) {
                case "small": return 32;
                case "large": return 64;
                default: return 48;
            }
        };

        const svgSize = getSvgSize();
        const strokeWidth = thickness ? parseInt(thickness) : (size === "small" ? 3 : size === "large" ? 6 : 4);
        const radius = (svgSize - strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;
        const strokeDashoffset = circumference - (normalizedValue / 100) * circumference;

        return (
            <div
                id={id}
                className={`progress progress--circular progress--${size} ${indeterminate ? "progress--indeterminate" : ""} ${className}`}
                style={progressStyle}
                role="progressbar"
                aria-valuenow={indeterminate ? undefined : normalizedValue}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={id ? `progress-${id}` : "Progress"}
            >
                <svg
                    className="progress__svg"
                    width={svgSize}
                    height={svgSize}
                    viewBox={`0 0 ${svgSize} ${svgSize}`}
                >
                    <circle
                        className="progress__track"
                        cx={svgSize / 2}
                        cy={svgSize / 2}
                        r={radius}
                        fill="none"
                        strokeWidth={strokeWidth}
                    />
                    <circle
                        className="progress__fill"
                        cx={svgSize / 2}
                        cy={svgSize / 2}
                        r={radius}
                        fill="none"
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={indeterminate ? circumference * 0.75 : strokeDashoffset}
                        transform={`rotate(-90 ${svgSize / 2} ${svgSize / 2})`}
                    />
                </svg>
                {(showLabel || label) && (
                    <span className="progress__label progress__label--center">
                        {renderLabel()}
                    </span>
                )}
            </div>
        );
    }

    // Linear progress
    return (
        <div
            id={id}
            className={`progress progress--linear progress--${size} ${indeterminate ? "progress--indeterminate" : ""} ${className}`}
            style={progressStyle}
            role="progressbar"
            aria-valuenow={indeterminate ? undefined : normalizedValue}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={id ? `progress-${id}` : "Progress"}
        >
            <div className="progress__track">
                <div
                    className="progress__fill"
                    style={{ width: indeterminate ? undefined : `${normalizedValue}%` }}
                />
            </div>
            {(showLabel || label) && (
                <span className="progress__label">{renderLabel()}</span>
            )}
        </div>
    );
};
