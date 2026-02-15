import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Table } from '../components/UXLib/Table/Table';
import { Pagination } from '../components/UXLib/Pagination/Pagination';
import type { TableColumn, SortDirection } from '../components/UXLib/Table/Table.types';

interface User {
    [key: string]: unknown;
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
}

const sampleData: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Moderator', status: 'Active' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'User', status: 'Pending' },
];

const columns: TableColumn<User>[] = [
    { key: 'id', header: 'ID', sortable: true, width: '60px' },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    { key: 'role', header: 'Role' },
    { key: 'status', header: 'Status', align: 'center' },
];

const meta = {
    title: 'UXLib/Table',
    component: Table,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    argTypes: {
        size: { control: 'select', options: ['small', 'medium', 'large'] },
        onRowClick: { action: 'row clicked' },
        onSortChange: { action: 'sort changed' },
    },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        columns: columns,
        data: sampleData,
    },
};

export const Striped: Story = {
    args: {
        columns: columns,
        data: sampleData,
        striped: true,
    },
};

export const Bordered: Story = {
    args: {
        columns: columns,
        data: sampleData,
        bordered: true,
    },
};

export const StripedAndBordered: Story = {
    args: {
        columns: columns,
        data: sampleData,
        striped: true,
        bordered: true,
    },
};

export const Small: Story = {
    args: {
        columns: columns,
        data: sampleData,
        size: 'small',
    },
};

export const Large: Story = {
    args: {
        columns: columns,
        data: sampleData,
        size: 'large',
    },
};

export const ClickableRows: Story = {
    args: {
        columns: columns,
        data: sampleData,
        hoverable: true,
    },
};

export const EmptyState: Story = {
    args: {
        columns: columns,
        data: [],
        emptyContent: 'No users found',
    },
};

export const CustomEmptyState: Story = {
    args: {
        columns: columns,
        data: [],
        emptyContent: (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>📭</p>
                <p>No data available</p>
                <p style={{ color: 'gray', fontSize: '0.875rem' }}>Try adjusting your filters</p>
            </div>
        ),
    },
};

// Interactive sorting example
const SortableTableComponent = () => {
    const [sortKey, setSortKey] = useState<string>('');
    const [sortDirection, setSortDirection] = useState<SortDirection>(null);
    const [data, setData] = useState(sampleData);

    const handleSortChange = (key: string, direction: SortDirection) => {
        setSortKey(key);
        setSortDirection(direction);

        if (direction === null) {
            setData(sampleData);
            return;
        }

        const sorted = [...sampleData].sort((a, b) => {
            const aVal = String(a[key as keyof User]);
            const bVal = String(b[key as keyof User]);
            return direction === 'asc'
                ? aVal.localeCompare(bVal)
                : bVal.localeCompare(aVal);
        });
        setData(sorted);
    };

    return (
        <Table
            columns={columns}
            data={data}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSortChange={handleSortChange}
            striped
        />
    );
};

export const WithSorting: Story = {
    render: () => <SortableTableComponent />,
};

// Custom cell rendering
const columnsWithCustomRender: TableColumn<User>[] = [
    { key: 'id', header: 'ID', width: '60px' },
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    {
        key: 'status',
        header: 'Status',
        render: (value) => {
            const colors: Record<string, string> = {
                Active: '#10b981',
                Inactive: '#ef4444',
                Pending: '#f59e0b',
            };
            return (
                <span style={{
                    backgroundColor: colors[value as string] || '#gray',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                }}>
                    {value as string}
                </span>
            );
        },
    },
];

export const CustomCellRender: Story = {
    args: {
        columns: columnsWithCustomRender,
        data: sampleData,
    },
};

// Generate more data for pagination demo
const generateData = (count: number): User[] => {
    const roles = ['Admin', 'User', 'Moderator', 'Guest'];
    const statuses = ['Active', 'Inactive', 'Pending'];
    return Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        role: roles[i % roles.length],
        status: statuses[i % statuses.length],
    }));
};

const paginatedData = generateData(50);

// Table with Pagination example
const TableWithPaginationComponent = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortKey, setSortKey] = useState<string>('');
    const [sortDirection, setSortDirection] = useState<SortDirection>(null);
    const pageSize = 10;

    const totalPages = Math.ceil(paginatedData.length / pageSize);

    // Sort data
    const sortedData = [...paginatedData].sort((a, b) => {
        if (!sortKey || !sortDirection) return 0;
        const aVal = String(a[sortKey as keyof User]);
        const bVal = String(b[sortKey as keyof User]);
        return sortDirection === 'asc'
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
    });

    // Paginate data
    const startIndex = (currentPage - 1) * pageSize;
    const currentData = sortedData.slice(startIndex, startIndex + pageSize);

    const handleSortChange = (key: string, direction: SortDirection) => {
        setSortKey(key);
        setSortDirection(direction);
        setCurrentPage(1); // Reset to first page on sort
    };

    return (
        <div>
            <Table
                columns={columns}
                data={currentData}
                sortKey={sortKey}
                sortDirection={sortDirection}
                onSortChange={handleSortChange}
                striped
                bordered
            />
            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>
            <p style={{ textAlign: 'center', color: 'gray', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                Showing {startIndex + 1}-{Math.min(startIndex + pageSize, paginatedData.length)} of {paginatedData.length} items
            </p>
        </div>
    );
};

export const WithPagination: Story = {
    render: () => <TableWithPaginationComponent />,
};
