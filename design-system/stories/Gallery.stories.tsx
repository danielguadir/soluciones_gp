import type { Meta, StoryObj } from '@storybook/react';
import { Gallery } from '../components/UXLib/Gallery/Gallery';
import type { GalleryItem } from '../components/UXLib/Gallery/Gallery.types';

const sampleImages: GalleryItem[] = [
    { src: 'https://picsum.photos/400/400?random=1', alt: 'Image 1', caption: 'Beautiful Landscape' },
    { src: 'https://picsum.photos/400/400?random=2', alt: 'Image 2', caption: 'City Skyline' },
    { src: 'https://picsum.photos/400/400?random=3', alt: 'Image 3', caption: 'Mountain View' },
    { src: 'https://picsum.photos/400/400?random=4', alt: 'Image 4', caption: 'Ocean Sunset' },
    { src: 'https://picsum.photos/400/400?random=5', alt: 'Image 5', caption: 'Forest Path' },
    { src: 'https://picsum.photos/400/400?random=6', alt: 'Image 6', caption: 'Desert Dunes' },
];

const meta = {
    title: 'UXLib/Gallery',
    component: Gallery,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    argTypes: {
        columns: { control: 'number' },
        aspectRatio: { control: 'select', options: ['1:1', '4:3', '16:9', 'auto'] },
        gap: { control: 'text' },
        onItemClick: { action: 'item clicked' },
    },
} satisfies Meta<typeof Gallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        items: sampleImages,
        columns: 3,
    },
};

export const TwoColumns: Story = {
    args: {
        items: sampleImages,
        columns: 2,
    },
};

export const FourColumns: Story = {
    args: {
        items: sampleImages,
        columns: 4,
    },
};

export const WithCaptions: Story = {
    args: {
        items: sampleImages,
        columns: 3,
        showCaptions: true,
    },
};

export const AspectRatio16x9: Story = {
    args: {
        items: sampleImages,
        columns: 2,
        aspectRatio: '16:9',
    },
};

export const AspectRatio4x3: Story = {
    args: {
        items: sampleImages,
        columns: 3,
        aspectRatio: '4:3',
    },
};

export const Clickable: Story = {
    args: {
        items: sampleImages,
        columns: 3,
        clickable: true,
    },
};

export const LargeGap: Story = {
    args: {
        items: sampleImages,
        columns: 3,
        gap: '2rem',
    },
};

export const SingleColumn: Story = {
    args: {
        items: sampleImages.slice(0, 3),
        columns: 1,
        aspectRatio: '16:9',
        showCaptions: true,
    },
};
