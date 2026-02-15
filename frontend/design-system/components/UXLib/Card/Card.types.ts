import type { ReactNode, CSSProperties, MouseEvent } from "react";

export type CardVariant = "elevated" | "outlined" | "filled";
export type CardSize = "small" | "medium" | "large";

export interface CardProps {
    /** Unique identifier */
    id?: string;
    /** Card title */
    title?: string;
    /** Card subtitle */
    subtitle?: string;
    /** Card content */
    children?: ReactNode;
    /** Footer content */
    footer?: ReactNode;
    /** Header actions (buttons, icons, etc.) */
    headerActions?: ReactNode;
    /** Card visual variant */
    variant?: CardVariant;
    /** Card size */
    size?: CardSize;
    /** Additional CSS class */
    className?: string;
    /** Custom styles */
    style?: CSSProperties;
    /** Click handler for the card */
    onClick?: (event: MouseEvent<HTMLDivElement>) => void;
    /** Whether the card is clickable (adds hover effect) */
    clickable?: boolean;
    /** Image URL or element to display at top */
    media?: string | ReactNode;
    /** Alt text for media image */
    mediaAlt?: string;
}
