import type { CSSProperties, ReactNode } from "react";

export type ProgressVariant = "linear" | "circular";
export type ProgressSize = "small" | "medium" | "large";

export interface ProgressProps {
    /** Unique identifier */
    id?: string;
    /** Progress value (0-100) */
    value: number;
    /** Progress variant */
    variant?: ProgressVariant;
    /** Progress size */
    size?: ProgressSize;
    /** Progress color */
    color?: string;
    /** Track/background color */
    trackColor?: string;
    /** Show percentage label */
    showLabel?: boolean;
    /** Custom label content */
    label?: ReactNode;
    /** Whether the progress is indeterminate (animated) */
    indeterminate?: boolean;
    /** Thickness of the progress bar/circle */
    thickness?: string;
    /** Additional CSS class */
    className?: string;
    /** Custom styles */
    style?: CSSProperties;
}
