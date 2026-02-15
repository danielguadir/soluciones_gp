import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from '../components/UXLib/Progress/Progress';

const meta = {
    title: 'UXLib/Progress',
    component: Progress,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
        variant: { control: 'select', options: ['linear', 'circular'] },
        size: { control: 'select', options: ['small', 'medium', 'large'] },
        color: { control: 'color' },
        trackColor: { control: 'color' },
    },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Linear: Story = {
    args: {
        value: 60,
        variant: 'linear',
    },
    decorators: [
        (Story) => (
            <div style={{ width: '300px' }}>
                <Story />
            </div>
        ),
    ],
};

export const LinearWithLabel: Story = {
    args: {
        value: 75,
        variant: 'linear',
        showLabel: true,
    },
    decorators: [
        (Story) => (
            <div style={{ width: '300px' }}>
                <Story />
            </div>
        ),
    ],
};

export const Circular: Story = {
    args: {
        value: 60,
        variant: 'circular',
    },
};

export const CircularWithLabel: Story = {
    args: {
        value: 85,
        variant: 'circular',
        showLabel: true,
    },
};

export const CircularCustomLabel: Story = {
    args: {
        value: 100,
        variant: 'circular',
        label: '✓',
    },
};

export const SmallLinear: Story = {
    args: {
        value: 50,
        variant: 'linear',
        size: 'small',
        showLabel: true,
    },
    decorators: [
        (Story) => (
            <div style={{ width: '200px' }}>
                <Story />
            </div>
        ),
    ],
};

export const LargeLinear: Story = {
    args: {
        value: 70,
        variant: 'linear',
        size: 'large',
        showLabel: true,
    },
    decorators: [
        (Story) => (
            <div style={{ width: '400px' }}>
                <Story />
            </div>
        ),
    ],
};

export const SmallCircular: Story = {
    args: {
        value: 65,
        variant: 'circular',
        size: 'small',
    },
};

export const LargeCircular: Story = {
    args: {
        value: 80,
        variant: 'circular',
        size: 'large',
        showLabel: true,
    },
};

export const IndeterminateLinear: Story = {
    args: {
        value: 0,
        variant: 'linear',
        indeterminate: true,
    },
    decorators: [
        (Story) => (
            <div style={{ width: '300px' }}>
                <Story />
            </div>
        ),
    ],
};

export const IndeterminateCircular: Story = {
    args: {
        value: 0,
        variant: 'circular',
        indeterminate: true,
    },
};

export const CustomColors: Story = {
    args: {
        value: 70,
        variant: 'linear',
        color: '#10b981',
        trackColor: '#d1fae5',
        showLabel: true,
    },
    decorators: [
        (Story) => (
            <div style={{ width: '300px' }}>
                <Story />
            </div>
        ),
    ],
};
