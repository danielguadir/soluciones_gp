import type { Meta, StoryObj } from '@storybook/react';
import { Card } from '../components/UXLib/Card/Card';
import { Button } from '../components/UXLib/Button/Button';

const meta = {
    title: 'UXLib/Card',
    component: Card,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: { control: 'select', options: ['elevated', 'outlined', 'filled'] },
        size: { control: 'select', options: ['small', 'medium', 'large'] },
        onClick: { action: 'clicked' },
    },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Elevated: Story = {
    args: {
        title: 'Card Title',
        subtitle: 'Card subtitle goes here',
        children: <p>This is the card content. You can put any content here.</p>,
        variant: 'elevated',
    },
};

export const Outlined: Story = {
    args: {
        title: 'Outlined Card',
        subtitle: 'With a border instead of shadow',
        children: <p>This card has a border instead of elevation shadow.</p>,
        variant: 'outlined',
    },
};

export const Filled: Story = {
    args: {
        title: 'Filled Card',
        subtitle: 'With background color',
        children: <p>This card has a subtle background color.</p>,
        variant: 'filled',
    },
};

export const WithMedia: Story = {
    args: {
        media: 'https://picsum.photos/400/200',
        mediaAlt: 'Random image',
        title: 'Card with Image',
        subtitle: 'Beautiful imagery',
        children: <p>This card displays an image at the top.</p>,
    },
};

export const WithFooter: Story = {
    args: {
        title: 'Card with Actions',
        children: <p>This card has action buttons in the footer.</p>,
        footer: (
            <>
                <Button nameBtn="Cancel" variant="text" />
                <Button nameBtn="Save" variant="contained" />
            </>
        ),
    },
};

export const Clickable: Story = {
    args: {
        title: 'Clickable Card',
        subtitle: 'Click me!',
        children: <p>This entire card is clickable and will respond to hover.</p>,
        clickable: true,
    },
};

export const CompleteCard: Story = {
    args: {
        media: 'https://picsum.photos/400/200',
        mediaAlt: 'Product image',
        title: 'Complete Card Example',
        subtitle: 'All features combined',
        headerActions: <Button icon="menu-1" iconPosition="center" variant="text" />,
        children: (
            <p>
                This card showcases all features: media, header with actions,
                content, and footer with buttons.
            </p>
        ),
        footer: (
            <>
                <Button nameBtn="Learn More" variant="outlined" />
                <Button nameBtn="Buy Now" variant="contained" />
            </>
        ),
    },
};
