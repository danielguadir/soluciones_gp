import type { CSSProperties } from "react";

export type PaginationSize = "small" | "medium" | "large";
export type PaginationVariant = "default" | "outlined" | "simple";

export interface PaginationProps {
    /** Unique identifier */
    id?: string;
    /** Current page (1-indexed) */
    currentPage: number;
    /** Total number of pages */
    totalPages: number;
    /** Callback when page changes */
    onPageChange: (page: number) => void;
    /** Number of page buttons to show on each side of current page */
    siblingCount?: number;
    /** Show first/last page buttons */
    showFirstLast?: boolean;
    /** Show previous/next buttons */
    showPrevNext?: boolean;
    /** Component size */
    size?: PaginationSize;
    /** Visual variant */
    variant?: PaginationVariant;
    /** Whether the component is disabled */
    disabled?: boolean;
    /** Additional CSS class */
    className?: string;
    /** Custom styles */
    style?: CSSProperties;
    /** Text for previous button (for simple variant) */
    previousLabel?: string;
    /** Text for next button (for simple variant) */
    nextLabel?: string;
}
