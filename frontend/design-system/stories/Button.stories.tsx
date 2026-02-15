import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../components/UXLib/Button/Button';

const meta = {
    title: 'UXLib/Button',
    component: Button,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: { control: 'select', options: ['contained', 'outlined', 'text', 'ghost'] },
        color: { control: 'color' },
        onClick: { action: 'clicked' },
    },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        nameBtn: 'Button',
        variant: 'contained',
    },
};

export const Outlined: Story = {
    args: {
        nameBtn: 'Outlined',
        variant: 'outlined',
    },
};

export const WithIconLeft: Story = {
    args: {
        nameBtn: 'Save',
        icon: 'save', // Assuming svgs are handled by name string in CmpSvg
        iconPosition: 'left',
    },
};

export const Ghost: Story = {
    args: {
        nameBtn: 'Ghost',
        variant: 'ghost',
    },
};

export const Text: Story = {
    args: {
        nameBtn: 'Text Button',
        variant: 'text',
    },
};
