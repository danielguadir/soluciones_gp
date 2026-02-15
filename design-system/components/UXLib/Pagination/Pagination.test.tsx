import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Pagination } from './Pagination'

vi.mock('../styles/cmpStyles.scss', () => ({}))

vi.mock('../Svg/Svg', () => ({
    Svg: ({ icon, className }: { icon: string; className?: string }) => (
        <i className={`${className || ''} icon-${icon}`} data-testid={`svg-${icon}`} />
    ),
}))

const renderPagination = (props = {}) => {
    const onPageChange = vi.fn()
    const result = render(
        <Pagination
            id="test-pagination"
            currentPage={1}
            totalPages={10}
            onPageChange={onPageChange}
            {...props}
        />
    )
    return { ...result, onPageChange }
}

describe('Pagination - General Tests', () => {
    describe('Basic rendering', () => {
        it('should render the pagination correctly', () => {
            renderPagination()
            expect(screen.getByRole('navigation')).toBeInTheDocument()
        })

        it('should render with id', () => {
            renderPagination()
            expect(document.querySelector('#test-pagination')).toBeInTheDocument()
        })

        it('should not render when totalPages is 1', () => {
            const { container } = render(
                <Pagination currentPage={1} totalPages={1} onPageChange={() => { }} />
            )
            expect(container.querySelector('.pagination')).not.toBeInTheDocument()
        })

        it('should render page numbers', () => {
            renderPagination({ totalPages: 5 })
            expect(screen.getByText('1')).toBeInTheDocument()
            expect(screen.getByText('2')).toBeInTheDocument()
            expect(screen.getByText('5')).toBeInTheDocument()
        })
    })

    describe('Navigation buttons', () => {
        it('should render first/last buttons when showFirstLast is true', () => {
            renderPagination({ showFirstLast: true })
            expect(screen.getByLabelText('First page')).toBeInTheDocument()
            expect(screen.getByLabelText('Last page')).toBeInTheDocument()
        })

        it('should render prev/next buttons when showPrevNext is true', () => {
            renderPagination({ showPrevNext: true })
            expect(screen.getByLabelText('Previous page')).toBeInTheDocument()
            expect(screen.getByLabelText('Next page')).toBeInTheDocument()
        })

        it('should not render first/last buttons when showFirstLast is false', () => {
            renderPagination({ showFirstLast: false })
            expect(screen.queryByLabelText('First page')).not.toBeInTheDocument()
            expect(screen.queryByLabelText('Last page')).not.toBeInTheDocument()
        })

        it('should disable previous button on first page', () => {
            renderPagination({ currentPage: 1 })
            expect(screen.getByLabelText('Previous page')).toBeDisabled()
        })

        it('should disable next button on last page', () => {
            renderPagination({ currentPage: 10, totalPages: 10 })
            expect(screen.getByLabelText('Next page')).toBeDisabled()
        })
    })

    describe('Page navigation', () => {
        it('should call onPageChange when page is clicked', async () => {
            const user = userEvent.setup()
            const { onPageChange } = renderPagination({ currentPage: 1, totalPages: 5 })

            await user.click(screen.getByText('3'))
            expect(onPageChange).toHaveBeenCalledWith(3)
        })

        it('should call onPageChange when next is clicked', async () => {
            const user = userEvent.setup()
            const { onPageChange } = renderPagination({ currentPage: 3, totalPages: 10 })

            await user.click(screen.getByLabelText('Next page'))
            expect(onPageChange).toHaveBeenCalledWith(4)
        })

        it('should call onPageChange when previous is clicked', async () => {
            const user = userEvent.setup()
            const { onPageChange } = renderPagination({ currentPage: 3, totalPages: 10 })

            await user.click(screen.getByLabelText('Previous page'))
            expect(onPageChange).toHaveBeenCalledWith(2)
        })

        it('should call onPageChange when first is clicked', async () => {
            const user = userEvent.setup()
            const { onPageChange } = renderPagination({ currentPage: 5, totalPages: 10 })

            await user.click(screen.getByLabelText('First page'))
            expect(onPageChange).toHaveBeenCalledWith(1)
        })

        it('should call onPageChange when last is clicked', async () => {
            const user = userEvent.setup()
            const { onPageChange } = renderPagination({ currentPage: 5, totalPages: 10 })

            await user.click(screen.getByLabelText('Last page'))
            expect(onPageChange).toHaveBeenCalledWith(10)
        })

        it('should not call onPageChange when clicking current page', async () => {
            const user = userEvent.setup()
            const { onPageChange } = renderPagination({ currentPage: 3, totalPages: 5 })

            await user.click(screen.getByText('3'))
            expect(onPageChange).not.toHaveBeenCalled()
        })
    })

    describe('Active page highlighting', () => {
        it('should mark current page as active', () => {
            const { container } = renderPagination({ currentPage: 3, totalPages: 5 })
            const activePage = container.querySelector('.pagination__page--active')
            expect(activePage).toHaveTextContent('3')
        })

        it('should have aria-current on active page', () => {
            renderPagination({ currentPage: 3, totalPages: 5 })
            const page3 = screen.getByText('3')
            expect(page3).toHaveAttribute('aria-current', 'page')
        })
    })

    describe('Ellipsis', () => {
        it('should show ellipsis for many pages', () => {
            renderPagination({ currentPage: 5, totalPages: 20 })
            const ellipses = screen.getAllByText('...')
            expect(ellipses.length).toBeGreaterThan(0)
        })

        it('should not show ellipsis for few pages', () => {
            renderPagination({ currentPage: 2, totalPages: 5 })
            expect(screen.queryByText('...')).not.toBeInTheDocument()
        })
    })

    describe('Sizes', () => {
        it('should apply medium size by default', () => {
            const { container } = renderPagination()
            expect(container.querySelector('.pagination--medium')).toBeInTheDocument()
        })

        it('should apply small size', () => {
            const { container } = renderPagination({ size: 'small' })
            expect(container.querySelector('.pagination--small')).toBeInTheDocument()
        })

        it('should apply large size', () => {
            const { container } = renderPagination({ size: 'large' })
            expect(container.querySelector('.pagination--large')).toBeInTheDocument()
        })
    })

    describe('Variants', () => {
        it('should apply default variant', () => {
            const { container } = renderPagination()
            expect(container.querySelector('.pagination--default')).toBeInTheDocument()
        })

        it('should apply outlined variant', () => {
            const { container } = renderPagination({ variant: 'outlined' })
            expect(container.querySelector('.pagination--outlined')).toBeInTheDocument()
        })

        it('should render simple variant with labels', () => {
            renderPagination({ variant: 'simple', previousLabel: 'Prev', nextLabel: 'Next' })
            expect(screen.getByText('Prev')).toBeInTheDocument()
            expect(screen.getByText('Next')).toBeInTheDocument()
            expect(screen.getByText('1 / 10')).toBeInTheDocument()
        })
    })

    describe('Disabled state', () => {
        it('should apply disabled class when disabled', () => {
            const { container } = renderPagination({ disabled: true })
            expect(container.querySelector('.pagination--disabled')).toBeInTheDocument()
        })

        it('should disable all page buttons when disabled', () => {
            const { container } = renderPagination({ disabled: true, currentPage: 5, totalPages: 10 })

            const pageButtons = container.querySelectorAll('.pagination__page')
            pageButtons.forEach(button => {
                expect(button).toHaveAttribute('disabled')
            })
        })
    })

    describe('Custom styles', () => {
        it('should apply custom className', () => {
            const { container } = renderPagination({ className: 'custom-pagination' })
            expect(container.querySelector('.custom-pagination')).toBeInTheDocument()
        })
    })
})
