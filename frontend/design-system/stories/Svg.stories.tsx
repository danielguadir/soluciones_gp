import type { Meta, StoryObj } from '@storybook/react';
import { Svg } from '../components/UXLib/Svg/Svg';

const meta = {
    title: 'UXLib/Svg',
    component: Svg,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        icon: { control: 'text' },
        fontSize: { control: 'text' },
        color: { control: 'color' },
        cursor: { control: 'select', options: ['default', 'pointer', 'not-allowed'] },
        title: { control: 'text' },
        onClick: { action: 'clicked' },
    },
} satisfies Meta<typeof Svg>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        icon: 'home',
        fontSize: '24px',
        color: '#333',
    },
};

export const Colored: Story = {
    args: {
        icon: 'star',
        fontSize: '32px',
        color: '#f39c12',
        title: 'Star icon',
    },
};

export const Clickable: Story = {
    args: {
        icon: 'plus',
        fontSize: '28px',
        color: '#3498db',
        title: 'Add item',
    },
};

export const Large: Story = {
    args: {
        icon: 'cog',
        fontSize: '48px',
        color: '#7f8c8d',
        title: 'Settings',
    },
};

export const IconGallery: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <Svg icon="home" fontSize="32px" color="#2c3e50" title="Home" />
            <Svg icon="user" fontSize="32px" color="#2c3e50" title="User" />
            <Svg icon="cog" fontSize="32px" color="#2c3e50" title="Settings" />
            <Svg icon="search" fontSize="32px" color="#2c3e50" title="Search" />
            <Svg icon="plus" fontSize="32px" color="#2c3e50" title="Add" />
            <Svg icon="cancel" fontSize="32px" color="#2c3e50" title="Cancel" />
            <Svg icon="ok-circled" fontSize="32px" color="#27ae60" title="Success" />
            <Svg icon="attention" fontSize="32px" color="#e74c3c" title="Warning" />
            <Svg icon="star" fontSize="32px" color="#f39c12" title="Star" />
            <Svg icon="heart" fontSize="32px" color="#e74c3c" title="Like" />
        </div>
    ),
};

export const Interactive: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Svg
                icon="trash"
                fontSize="28px"
                color="#e74c3c"
                title="Delete"
                onClick={() => alert('Delete clicked!')}
            />
            <Svg
                icon="pencil"
                fontSize="28px"
                color="#3498db"
                title="Edit"
                onClick={() => alert('Edit clicked!')}
            />
            <Svg
                icon="eye"
                fontSize="28px"
                color="#9b59b6"
                title="View"
                onClick={() => alert('View clicked!')}
            />
        </div>
    ),
};
