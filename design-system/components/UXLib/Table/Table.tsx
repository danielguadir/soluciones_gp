import type { CSSProperties, MouseEvent } from "react";
import { Svg } from "../Svg/Svg";
import type { TableProps, TableColumn, SortDirection } from "./Table.types";

export const Table = <T extends Record<string, unknown>>({
    id,
    columns,
    data,
    size = "medium",
    striped = false,
    hoverable = true,
    bordered = false,
    onRowClick,
    onSortChange,
    sortKey,
    sortDirection,
    className = "",
    style = {},
    emptyContent = "No hay datos disponibles",
    fullWidth = true,
    loading = false,
}: TableProps<T>) => {
    const tableStyle: CSSProperties = {
        ...style,
    };

    const handleSort = (column: TableColumn<T>) => {
        if (!column.sortable || !onSortChange) return;

        let newDirection: SortDirection = "asc";
        if (sortKey === column.key) {
            if (sortDirection === "asc") newDirection = "desc";
            else if (sortDirection === "desc") newDirection = null;
            else newDirection = "asc";
        }

        onSortChange(column.key, newDirection);
    };

    const handleRowClick = (row: T, index: number, event: MouseEvent<HTMLTableRowElement>) => {
        if (onRowClick) {
            onRowClick(row, index, event);
        }
    };

    const handleRowKeyDown = (row: T, index: number, event: React.KeyboardEvent<HTMLTableRowElement>) => {
        if (onRowClick && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            onRowClick(row, index, event as unknown as MouseEvent<HTMLTableRowElement>);
        }
    };

    const getCellValue = (row: T, column: TableColumn<T>, rowIndex: number) => {
        const value = row[column.key];
        if (column.render) {
            return column.render(value, row, rowIndex);
        }
        return value as React.ReactNode;
    };

    const getSortIcon = (column: TableColumn<T>) => {
        if (!column.sortable) return null;

        if (sortKey !== column.key) {
            return <Svg icon="sort" fontSize="0.75rem" color="var(--text-secondary)" className="table__sort-icon" />;
        }

        if (sortDirection === "asc") {
            return <Svg icon="up-open-mini" fontSize="0.75rem" color="var(--primary-color)" className="table__sort-icon" />;
        }

        if (sortDirection === "desc") {
            return <Svg icon="down-open-mini" fontSize="0.75rem" color="var(--primary-color)" className="table__sort-icon" />;
        }

        return <Svg icon="sort" fontSize="0.75rem" color="var(--text-secondary)" className="table__sort-icon" />;
    };

    const tableClasses = [
        "table",
        `table--${size}`,
        striped && "table--striped",
        hoverable && "table--hoverable",
        bordered && "table--bordered",
        fullWidth && "table--full-width",
        className,
    ].filter(Boolean).join(" ");

    const isClickable = !!onRowClick;

    return (
        <div className="table-container">
            {loading && (
                <div className="table-loading-overlay">
                    <div className="table-loading-spinner"></div>
                    <span className="table-loading-text">Cargando...</span>
                </div>
            )}
            <table
                id={id}
                className={tableClasses}
                style={tableStyle}
                role="table"
                aria-label={id ? `table-${id}` : "Data table"}
            >
                <thead className="table__head">
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                className={`table__header ${column.sortable ? "table__header--sortable" : ""}`}
                                style={{ width: column.width, textAlign: column.align || "left" }}
                                onClick={() => handleSort(column)}
                                onKeyDown={(e) => {
                                    if (column.sortable && (e.key === "Enter" || e.key === " ")) {
                                        e.preventDefault();
                                        handleSort(column);
                                    }
                                }}
                                tabIndex={column.sortable ? 0 : undefined}
                                role={column.sortable ? "button" : undefined}
                                aria-sort={
                                    sortKey === column.key
                                        ? sortDirection === "asc"
                                            ? "ascending"
                                            : sortDirection === "desc"
                                                ? "descending"
                                                : "none"
                                        : undefined
                                }
                            >
                                <span className="table__header-content">
                                    {column.header}
                                    {getSortIcon(column)}
                                </span>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="table__body">
                    {data.length === 0 ? (
                        <tr className="table__row table__row--empty">
                            <td colSpan={columns.length} className="table__cell table__cell--empty">
                                {emptyContent}
                            </td>
                        </tr>
                    ) : (
                        data.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className={`table__row ${isClickable ? "table__row--clickable" : ""}`}
                                onClick={(e) => handleRowClick(row, rowIndex, e)}
                                onKeyDown={(e) => handleRowKeyDown(row, rowIndex, e)}
                                tabIndex={isClickable ? 0 : undefined}
                            >
                                {columns.map((column) => (
                                    <td
                                        key={column.key}
                                        className="table__cell"
                                        style={{ textAlign: column.align || "left" }}
                                    >
                                        {getCellValue(row, column, rowIndex)}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};
