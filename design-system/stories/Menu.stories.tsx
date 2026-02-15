import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Menu } from '../components/UXLib/Menu/Menu';
import type { MenuItem, UserProfile } from '../components/UXLib/Menu/Menu.types';

const meta: Meta<typeof Menu> = {
    title: 'Navigation/Menu',
    component: Menu,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Menu>;

const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'home', active: true },
    { id: 'search', label: 'Search', icon: 'search' },
    {
        id: 'reporting',
        label: 'Reporting',
        icon: 'chart-pie',
        subItems: [
            { id: 'checkins', label: 'Check-ins' },
            { id: 'objectives', label: 'Objectives' },
            { id: 'career', label: 'Career Hub' },
        ],
    },
    { id: 'notifications', label: 'Notifications', icon: 'bell' },
    { id: 'mail', label: 'Mail / Inbox', icon: 'chat' },
    { id: 'kanban', label: 'Kanban', icon: 'th-list' },
    { id: 'tasks', label: 'Tasks', icon: 'list-numbered', badge: '3' },
];

const secondaryItems: MenuItem[] = [
    { id: 'doc', label: 'Documentation', icon: 'archive' },
    { id: 'support', label: 'Support', icon: 'question' },
    { id: 'settings', label: 'Settings', icon: 'cog' },
];

const user: UserProfile = {
    name: 'Anna Taylor',
    email: 'anna.taylor@example.com',
};

export const Default: Story = {
    args: {
        items: menuItems,
        secondaryItems: secondaryItems,
        user: user,
    },
    render: (args) => {
        const [expanded, setExpanded] = useState(true);
        const [activeId, setActiveId] = useState('dashboard');

        const mapActive = (items: MenuItem[]) =>
            items.map(item => ({
                ...item,
                active: item.id === activeId,
                subItems: item.subItems?.map(sub => ({
                    ...sub,
                    active: sub.id === activeId
                })),
                onClick: () => {
                    if (!item.subItems || !expanded) {
                        setActiveId(item.id);
                    }
                    item.onClick?.();
                }
            }));

        const itemsWithClick = mapActive(args.items);
        const secItemsWithClick = mapActive(args.secondaryItems || []);

        return (
            <div style={{ height: '100vh', display: 'flex' }}>
                <Menu
                    {...args}
                    items={itemsWithClick}
                    secondaryItems={secItemsWithClick}
                    expanded={expanded}
                    onToggleExpand={setExpanded}
                />
                <div style={{ flex: 1, padding: '20px', backgroundColor: 'var(--bg-color)' }}>
                    <h1>Content Area</h1>
                    <p>Active Item ID: <strong>{activeId}</strong></p>
                    <p>This is where the main content of the application would go.</p>
                </div>
            </div>
        );
    }
};

export const Collapsed: Story = {
    args: {
        items: menuItems,
        secondaryItems: secondaryItems,
        user: user,
        expanded: false,
    },
    render: (args) => {
        const [expanded, setExpanded] = useState(false);
        const [activeId, setActiveId] = useState('dashboard');

        const mapActive = (items: MenuItem[]) =>
            items.map(item => ({
                ...item,
                active: item.id === activeId,
                onClick: () => {
                    setActiveId(item.id);
                    item.onClick?.();
                }
            }));

        const itemsWithClick = mapActive(args.items);
        const secItemsWithClick = mapActive(args.secondaryItems || []);

        return (
            <div style={{ height: '100vh', display: 'flex' }}>
                <Menu
                    {...args}
                    items={itemsWithClick}
                    secondaryItems={secItemsWithClick}
                    expanded={expanded}
                    onToggleExpand={setExpanded}
                />
                <div style={{ flex: 1, padding: '20px', backgroundColor: 'var(--bg-color)' }}>
                    <h1>Content Area</h1>
                    <p>Sidebar is currently collapsed.</p>
                </div>
            </div>
        );
    }
};

export const DarkMode: Story = {
    args: {
        items: menuItems,
        secondaryItems: secondaryItems,
        user: user,
    },
    render: (args) => {
        const [expanded, setExpanded] = useState(true);
        const [activeId, setActiveId] = useState('dashboard');

        const mapActive = (items: MenuItem[]) =>
            items.map(item => ({
                ...item,
                active: item.id === activeId,
                onClick: () => {
                    setActiveId(item.id);
                    item.onClick?.();
                }
            }));

        return (
            <div data-theme="dark" style={{ height: '100vh', display: 'flex', color: 'white' }}>
                <Menu
                    {...args}
                    items={mapActive(args.items)}
                    secondaryItems={mapActive(args.secondaryItems || [])}
                    expanded={expanded}
                    onToggleExpand={setExpanded}
                />
                <div style={{ flex: 1, padding: '20px', backgroundColor: 'var(--bg-color)' }}>
                    <h1>Dark Mode Preview</h1>
                    <p>The sidebar adjusts automatically to dark theme variables.</p>
                </div>
            </div>
        );
    }
};
