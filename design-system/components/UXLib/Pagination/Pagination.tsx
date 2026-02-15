import type { CSSProperties } from "react";
import { Svg } from "../Svg/Svg";
import type { PaginationProps } from "./Pagination.types";

export const Pagination = ({
    id,
    currentPage,
    totalPages,
    onPageChange,
    siblingCount = 1,
    showFirstLast = true,
    showPrevNext = true,
    size = "medium",
    variant = "default",
    disabled = false,
    className = "",
    style = {},
    previousLabel = "Anterior",
    nextLabel = "Siguiente",
}: PaginationProps) => {
    const paginationStyle: CSSProperties = {
        ...style,
    };

    // Generate page numbers to display
    const getPageNumbers = (): (number | string)[] => {
        const pages: (number | string)[] = [];
        const totalNumbers = siblingCount * 2 + 3; // siblings + current + first + last
        const totalBlocks = totalNumbers + 2; // + 2 for ellipsis

        if (totalPages <= totalBlocks) {
            // Show all pages
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
            const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

            const showLeftEllipsis = leftSiblingIndex > 2;
            const showRightEllipsis = rightSiblingIndex < totalPages - 1;

            if (!showLeftEllipsis && showRightEllipsis) {
                // Show more pages at the start
                const leftRange = 3 + 2 * siblingCount;
                for (let i = 1; i <= leftRange; i++) {
                    pages.push(i);
                }
                pages.push("...");
                pages.push(totalPages);
            } else if (showLeftEllipsis && !showRightEllipsis) {
                // Show more pages at the end
                pages.push(1);
                pages.push("...");
                const rightRange = 3 + 2 * siblingCount;
                for (let i = totalPages - rightRange + 1; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                // Show ellipsis on both sides
                pages.push(1);
                pages.push("...");
                for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
                    pages.push(i);
                }
                pages.push("...");
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const handlePageClick = (page: number) => {
        if (disabled || page === currentPage || page < 1 || page > totalPages) {
            return;
        }
        onPageChange(page);
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            handlePageClick(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            handlePageClick(currentPage + 1);
        }
    };

    const handleFirst = () => {
        handlePageClick(1);
    };

    const handleLast = () => {
        handlePageClick(totalPages);
    };

    if (totalPages <= 1) {
        return null;
    }

    // Simple variant just shows prev/next with page info
    if (variant === "simple") {
        return (
            <nav
                id={id}
                className={`pagination pagination--${size} pagination--${variant} ${disabled ? "pagination--disabled" : ""} ${className}`}
                style={paginationStyle}
                role="navigation"
                aria-label="Pagination"
            >
                <button
                    className="pagination__btn pagination__btn--prev"
                    onClick={handlePrevious}
                    disabled={disabled || currentPage === 1}
                    aria-label="Previous page"
                >
                    <Svg icon="angle-left" fontSize="1rem" />
                    <span>{previousLabel}</span>
                </button>
                <span className="pagination__info">
                    {currentPage} / {totalPages}
                </span>
                <button
                    className="pagination__btn pagination__btn--next"
                    onClick={handleNext}
                    disabled={disabled || currentPage === totalPages}
                    aria-label="Next page"
                >
                    <span>{nextLabel}</span>
                    <Svg icon="angle-right" fontSize="1rem" />
                </button>
            </nav>
        );
    }

    const pageNumbers = getPageNumbers();

    return (
        <nav
            id={id}
            className={`pagination pagination--${size} pagination--${variant} ${disabled ? "pagination--disabled" : ""} ${className}`}
            style={paginationStyle}
            role="navigation"
            aria-label="Pagination"
        >
            {showFirstLast && (
                <button
                    className="pagination__btn pagination__btn--first"
                    onClick={handleFirst}
                    disabled={disabled || currentPage === 1}
                    aria-label="First page"
                >
                    <Svg icon="angle-double-left" fontSize="1rem" />
                </button>
            )}

            {showPrevNext && (
                <button
                    className="pagination__btn pagination__btn--prev"
                    onClick={handlePrevious}
                    disabled={disabled || currentPage === 1}
                    aria-label="Previous page"
                >
                    <Svg icon="angle-left" fontSize="1rem" />
                </button>
            )}

            <div className="pagination__pages">
                {pageNumbers.map((page, index) => {
                    if (page === "...") {
                        return (
                            <span key={`ellipsis-${index}`} className="pagination__ellipsis">
                                ...
                            </span>
                        );
                    }

                    const pageNum = page as number;
                    return (
                        <button
                            key={pageNum}
                            className={`pagination__page ${currentPage === pageNum ? "pagination__page--active" : ""}`}
                            onClick={() => handlePageClick(pageNum)}
                            disabled={disabled}
                            aria-label={`Page ${pageNum}`}
                            aria-current={currentPage === pageNum ? "page" : undefined}
                        >
                            {pageNum}
                        </button>
                    );
                })}
            </div>

            {showPrevNext && (
                <button
                    className="pagination__btn pagination__btn--next"
                    onClick={handleNext}
                    disabled={disabled || currentPage === totalPages}
                    aria-label="Next page"
                >
                    <Svg icon="angle-right" fontSize="1rem" />
                </button>
            )}

            {showFirstLast && (
                <button
                    className="pagination__btn pagination__btn--last"
                    onClick={handleLast}
                    disabled={disabled || currentPage === totalPages}
                    aria-label="Last page"
                >
                    <Svg icon="angle-double-right" fontSize="1rem" />
                </button>
            )}
        </nav>
    );
};
