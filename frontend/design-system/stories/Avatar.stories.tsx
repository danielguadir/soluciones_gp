import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "../components/UXLib/Avatar/Avatar";

const meta: Meta<typeof Avatar> = {
    title: "Data Display/Avatar",
    component: Avatar,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        size: {
            control: { type: "select" },
            options: ["xs", "sm", "md", "lg", "xl"],
        },
        shape: {
            control: { type: "select" },
            options: ["circle", "rounded", "square"],
        },
    },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Image: Story = {
    args: {
        src: "https://i.pravatar.cc/300?u=anna",
        alt: "Anna Taylor",
        size: "lg",
        shape: "circle",
    },
};

export const Initials: Story = {
    args: {
        name: "Anna Taylor",
        size: "lg",
        shape: "circle",
        color: "var(--color-brand-primary)",
    },
};

export const Icon: Story = {
    args: {
        icon: "user",
        size: "lg",
        shape: "circle",
    },
};

export const Shapes: Story = {
    render: () => (
        <div style={{ display: "flex", gap: "20px" }}>
            <Avatar name="Circle" shape="circle" size="lg" color="#6366f1" />
            <Avatar name="Rounded" shape="rounded" size="lg" color="#a855f7" />
            <Avatar name="Square" shape="square" size="lg" color="#14b8a6" />
        </div>
    ),
};

export const Sizes: Story = {
    render: () => (
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <Avatar name="XS" size="xs" />
            <Avatar name="SM" size="sm" />
            <Avatar name="MD" size="md" />
            <Avatar name="LG" size="lg" />
            <Avatar name="XL" size="xl" />
            <Avatar name="Custom" size={120} color="#f59e0b" />
        </div>
    ),
};

export const Fallback: Story = {
    args: {
        src: "invalid-url",
        name: "John Doe",
        size: "lg",
    },
};

export const DarkMode: Story = {
    render: () => (
        <div data-theme="dark" style={{ padding: "40px", background: "var(--bg-color)", borderRadius: "8px" }}>
            <div style={{ display: "flex", gap: "20px" }}>
                <Avatar src="https://i.pravatar.cc/300?u=dark" size="lg" />
                <Avatar name="Dark Mode" size="lg" />
                <Avatar icon="cog" size="lg" />
            </div>
        </div>
    ),
};
