import type { CSSProperties, ReactNode } from "react";

export type DividerOrientation = "horizontal" | "vertical";
export type DividerVariant = "solid" | "dashed" | "dotted";

export interface DividerProps {
    /** Unique identifier */
    id?: string;
    /** Divider orientation */
    orientation?: DividerOrientation;
    /** Line style variant */
    variant?: DividerVariant;
    /** Divider color */
    color?: string;
    /** Line thickness */
    thickness?: string;
    /** Margin/spacing around the divider */
    spacing?: string;
    /** Optional label text in the middle */
    label?: ReactNode;
    /** Label position for horizontal dividers */
    labelPosition?: "left" | "center" | "right";
    /** Additional CSS class */
    className?: string;
    /** Custom styles */
    style?: CSSProperties;
}
