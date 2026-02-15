import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Pagination } from '../components/UXLib/Pagination/Pagination';

const meta = {
    title: 'UXLib/Pagination',
    component: Pagination,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        currentPage: { control: { type: 'number', min: 1 } },
        totalPages: { control: { type: 'number', min: 1 } },
        size: { control: 'select', options: ['small', 'medium', 'large'] },
        variant: { control: 'select', options: ['default', 'outlined', 'simple'] },
        siblingCount: { control: { type: 'number', min: 0, max: 3 } },
        onPageChange: { action: 'page changed' },
    },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive example
const InteractivePagination = (args: React.ComponentProps<typeof Pagination>) => {
    const [page, setPage] = useState(args.currentPage);
    return (
        <Pagination
            {...args}
            currentPage={page}
            onPageChange={setPage}
        />
    );
};

export const Default: Story = {
    args: {
        currentPage: 1,
        totalPages: 10,
    },
    render: (args) => <InteractivePagination {...args} />,
};

export const ManyPages: Story = {
    args: {
        currentPage: 15,
        totalPages: 50,
    },
    render: (args) => <InteractivePagination {...args} />,
};

export const FewPages: Story = {
    args: {
        currentPage: 2,
        totalPages: 5,
    },
    render: (args) => <InteractivePagination {...args} />,
};

export const Outlined: Story = {
    args: {
        currentPage: 5,
        totalPages: 20,
        variant: 'outlined',
    },
    render: (args) => <InteractivePagination {...args} />,
};

export const Simple: Story = {
    args: {
        currentPage: 3,
        totalPages: 10,
        variant: 'simple',
    },
    render: (args) => <InteractivePagination {...args} />,
};

export const Small: Story = {
    args: {
        currentPage: 5,
        totalPages: 15,
        size: 'small',
    },
    render: (args) => <InteractivePagination {...args} />,
};

export const Large: Story = {
    args: {
        currentPage: 5,
        totalPages: 15,
        size: 'large',
    },
    render: (args) => <InteractivePagination {...args} />,
};

export const WithMoreSiblings: Story = {
    args: {
        currentPage: 10,
        totalPages: 30,
        siblingCount: 2,
    },
    render: (args) => <InteractivePagination {...args} />,
};

export const WithoutFirstLast: Story = {
    args: {
        currentPage: 5,
        totalPages: 20,
        showFirstLast: false,
    },
    render: (args) => <InteractivePagination {...args} />,
};

export const WithoutPrevNext: Story = {
    args: {
        currentPage: 5,
        totalPages: 20,
        showPrevNext: false,
    },
    render: (args) => <InteractivePagination {...args} />,
};

export const Disabled: Story = {
    args: {
        currentPage: 5,
        totalPages: 20,
        disabled: true,
    },
};

export const CustomLabels: Story = {
    args: {
        currentPage: 3,
        totalPages: 10,
        variant: 'simple',
        previousLabel: '← Previous',
        nextLabel: 'Next →',
    },
    render: (args) => <InteractivePagination {...args} />,
};
