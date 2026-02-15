import type { CSSProperties, ReactNode, MouseEvent } from "react";

export type TableSize = "small" | "medium" | "large";
export type SortDirection = "asc" | "desc" | null;

export interface TableColumn<T = Record<string, unknown>> {
    /** Unique key for the column */
    key: string;
    /** Header text */
    header: string | ReactNode;
    /** Column width */
    width?: string;
    /** Whether the column is sortable */
    sortable?: boolean;
    /** Custom render function for cell content */
    render?: (value: unknown, row: T, index: number) => ReactNode;
    /** Text alignment */
    align?: "left" | "center" | "right";
}

export interface TableProps<T = Record<string, unknown>> {
    /** Unique identifier */
    id?: string;
    /** Column definitions */
    columns: TableColumn<T>[];
    /** Data rows */
    data: T[];
    /** Table size */
    size?: TableSize;
    /** Show striped rows */
    striped?: boolean;
    /** Show hover effect on rows */
    hoverable?: boolean;
    /** Show borders */
    bordered?: boolean;
    /** Row click handler */
    onRowClick?: (row: T, index: number, event: MouseEvent<HTMLTableRowElement>) => void;
    /** Sort change handler */
    onSortChange?: (key: string, direction: SortDirection) => void;
    /** Current sort column key */
    sortKey?: string;
    /** Current sort direction */
    sortDirection?: SortDirection;
    /** Additional CSS class */
    className?: string;
    /** Custom styles */
    style?: CSSProperties;
    /** Empty state content */
    emptyContent?: ReactNode;
    /** Whether the table should be full width */
    fullWidth?: boolean;
    /** Whether the table is in a loading state */
    loading?: boolean;
}
