import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Table } from './Table'
import type { TableColumn } from './Table.types'

vi.mock('../styles/cmpStyles.scss', () => ({}))

vi.mock('../Svg/Svg', () => ({
    Svg: ({ icon, className }: { icon: string; className: string }) => (
        <i className={`${className} icon-${icon}`} data-testid="svg-mock" />
    ),
}))

interface TestData {
    [key: string]: unknown;
    id: number;
    name: string;
    email: string;
}

const mockColumns: TableColumn<TestData>[] = [
    { key: 'id', header: 'ID', sortable: true },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'email', header: 'Email' },
]

const mockData: TestData[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
]

const renderTable = (props = {}) => {
    return render(
        <Table
            id="test-table"
            columns={mockColumns}
            data={mockData}
            {...props}
        />
    )
}

describe('Table - General Tests', () => {
    describe('Basic rendering', () => {
        it('should render the table correctly', () => {
            renderTable()
            expect(screen.getByRole('table')).toBeInTheDocument()
        })

        it('should render with id', () => {
            renderTable()
            expect(document.querySelector('#test-table')).toBeInTheDocument()
        })

        it('should render all columns', () => {
            renderTable()
            expect(screen.getByText('ID')).toBeInTheDocument()
            expect(screen.getByText('Name')).toBeInTheDocument()
            expect(screen.getByText('Email')).toBeInTheDocument()
        })

        it('should render all data rows', () => {
            renderTable()
            expect(screen.getByText('John Doe')).toBeInTheDocument()
            expect(screen.getByText('Jane Smith')).toBeInTheDocument()
            expect(screen.getByText('Bob Johnson')).toBeInTheDocument()
        })

        it('should render cell values', () => {
            renderTable()
            expect(screen.getByText('john@example.com')).toBeInTheDocument()
        })
    })

    describe('Empty state', () => {
        it('should show empty content when no data', () => {
            renderTable({ data: [] })
            expect(screen.getByText('No hay datos disponibles')).toBeInTheDocument()
        })

        it('should show custom empty content', () => {
            renderTable({ data: [], emptyContent: 'No records found' })
            expect(screen.getByText('No records found')).toBeInTheDocument()
        })
    })

    describe('Styling variants', () => {
        it('should apply medium size by default', () => {
            const { container } = renderTable()
            expect(container.querySelector('.table--medium')).toBeInTheDocument()
        })

        it('should apply small size', () => {
            const { container } = renderTable({ size: 'small' })
            expect(container.querySelector('.table--small')).toBeInTheDocument()
        })

        it('should apply striped class', () => {
            const { container } = renderTable({ striped: true })
            expect(container.querySelector('.table--striped')).toBeInTheDocument()
        })

        it('should apply hoverable class by default', () => {
            const { container } = renderTable()
            expect(container.querySelector('.table--hoverable')).toBeInTheDocument()
        })

        it('should apply bordered class', () => {
            const { container } = renderTable({ bordered: true })
            expect(container.querySelector('.table--bordered')).toBeInTheDocument()
        })

        it('should apply full-width class by default', () => {
            const { container } = renderTable()
            expect(container.querySelector('.table--full-width')).toBeInTheDocument()
        })
    })

    describe('Sorting', () => {
        it('should show sort icons for sortable columns', () => {
            const { container } = renderTable()
            const sortIcons = container.querySelectorAll('.table__sort-icon')
            expect(sortIcons.length).toBeGreaterThan(0)
        })

        it('should have sortable class for sortable columns', () => {
            const { container } = renderTable()
            expect(container.querySelectorAll('.table__header--sortable')).toHaveLength(2)
        })

        it('should call onSortChange when sortable header is clicked', async () => {
            const user = userEvent.setup()
            const handleSortChange = vi.fn()
            renderTable({ onSortChange: handleSortChange })

            await user.click(screen.getByText('ID'))

            expect(handleSortChange).toHaveBeenCalledWith('id', 'asc')
        })

        it('should toggle sort direction', async () => {
            const user = userEvent.setup()
            const handleSortChange = vi.fn()
            renderTable({
                onSortChange: handleSortChange,
                sortKey: 'id',
                sortDirection: 'asc',
            })

            await user.click(screen.getByText('ID'))

            expect(handleSortChange).toHaveBeenCalledWith('id', 'desc')
        })
    })

    describe('Row click', () => {
        it('should call onRowClick when row is clicked', async () => {
            const user = userEvent.setup()
            const handleRowClick = vi.fn()
            renderTable({ onRowClick: handleRowClick })

            const rows = screen.getAllByRole('row')
            await user.click(rows[1]) // First data row (skip header)

            expect(handleRowClick).toHaveBeenCalledWith(
                mockData[0],
                0,
                expect.any(Object)
            )
        })

        it('should have clickable class when onRowClick is provided', () => {
            const { container } = renderTable({ onRowClick: vi.fn() })
            expect(container.querySelector('.table__row--clickable')).toBeInTheDocument()
        })

        it('should be focusable when clickable', () => {
            const { container } = renderTable({ onRowClick: vi.fn() })
            const row = container.querySelector('.table__row--clickable')
            expect(row).toHaveAttribute('tabindex', '0')
        })
    })

    describe('Custom render', () => {
        it('should use custom render function', () => {
            const columnsWithRender: TableColumn<TestData>[] = [
                ...mockColumns,
                {
                    key: 'action',
                    header: 'Actions',
                    render: () => <button>Edit</button>,
                },
            ]

            render(
                <Table
                    id="test"
                    columns={columnsWithRender}
                    data={mockData}
                />
            )

            expect(screen.getAllByText('Edit')).toHaveLength(3)
        })
    })

    describe('Column alignment', () => {
        it('should apply text alignment to header and cells', () => {
            const columnsWithAlign: TableColumn<TestData>[] = [
                { key: 'id', header: 'ID', align: 'center' },
                { key: 'name', header: 'Name', align: 'right' },
            ]

            const { container } = render(
                <Table
                    id="test"
                    columns={columnsWithAlign}
                    data={mockData}
                />
            )

            const headers = container.querySelectorAll('.table__header')
            expect(headers[0]).toHaveStyle('text-align: center')
            expect(headers[1]).toHaveStyle('text-align: right')
        })
    })

    describe('Custom styles', () => {
        it('should apply custom className', () => {
            const { container } = renderTable({ className: 'custom-table' })
            expect(container.querySelector('.custom-table')).toBeInTheDocument()
        })

        it('should apply custom style', () => {
            const { container } = renderTable({ style: { minWidth: '500px' } })
            const table = container.querySelector('.table')
            expect(table?.getAttribute('style')).toContain('min-width: 500px')
        })
    })

    describe('Accessibility', () => {
        it('should have proper aria-label', () => {
            renderTable()
            expect(screen.getByLabelText('table-test-table')).toBeInTheDocument()
        })

        it('should have aria-sort for sorted columns', () => {
            renderTable({ sortKey: 'id', sortDirection: 'asc' })
            const idHeader = screen.getByText('ID').closest('th')
            expect(idHeader).toHaveAttribute('aria-sort', 'ascending')
        })

        it('should have role button for sortable headers', () => {
            renderTable()
            const idHeader = screen.getByText('ID').closest('th')
            expect(idHeader).toHaveAttribute('role', 'button')
        })
    })
})
