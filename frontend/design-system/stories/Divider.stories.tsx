import type { Meta, StoryObj } from '@storybook/react';
import { Divider } from '../components/UXLib/Divider/Divider';

const meta = {
    title: 'UXLib/Divider',
    component: Divider,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    argTypes: {
        orientation: { control: 'select', options: ['horizontal', 'vertical'] },
        variant: { control: 'select', options: ['solid', 'dashed', 'dotted'] },
        color: { control: 'color' },
        thickness: { control: 'text' },
        spacing: { control: 'text' },
        labelPosition: { control: 'select', options: ['left', 'center', 'right'] },
    },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Solid: Story = {
    args: {
        variant: 'solid',
    },
};

export const Dashed: Story = {
    args: {
        variant: 'dashed',
    },
};

export const Dotted: Story = {
    args: {
        variant: 'dotted',
    },
};

export const WithLabel: Story = {
    args: {
        label: 'OR',
        variant: 'solid',
    },
};

export const LabelLeft: Story = {
    args: {
        label: 'Section',
        labelPosition: 'left',
    },
};

export const LabelRight: Story = {
    args: {
        label: 'End',
        labelPosition: 'right',
    },
};

export const CustomColor: Story = {
    args: {
        color: '#6366f1',
        thickness: '2px',
    },
};

export const Vertical: Story = {
    args: {
        orientation: 'vertical',
    },
    decorators: [
        (Story) => (
            <div style={{ display: 'flex', alignItems: 'center', height: '100px', gap: '1rem' }}>
                <span>Left Content</span>
                <Story />
                <span>Right Content</span>
            </div>
        ),
    ],
};

export const InContext: Story = {
    args: {
        spacing: '1.5rem',
    },
    decorators: [
        (Story) => (
            <div style={{ maxWidth: '400px' }}>
                <p>This is some content above the divider.</p>
                <Story />
                <p>This is some content below the divider.</p>
            </div>
        ),
    ],
};
