import type { CSSProperties, MouseEvent } from "react";

export interface GalleryItem {
    /** Image source URL */
    src: string;
    /** Alt text for accessibility */
    alt?: string;
    /** Thumbnail URL (defaults to src if not provided) */
    thumbnail?: string;
    /** Image caption */
    caption?: string;
    /** Unique identifier for the item */
    id?: string | number;
}

export type GalleryAspectRatio = "1:1" | "4:3" | "16:9" | "auto";

export interface GalleryProps {
    /** Unique identifier */
    id?: string;
    /** Array of gallery items */
    items: GalleryItem[];
    /** Number of columns */
    columns?: number | "auto";
    /** Gap between items */
    gap?: string;
    /** Aspect ratio for images */
    aspectRatio?: GalleryAspectRatio;
    /** Click handler for gallery items */
    onItemClick?: (item: GalleryItem, index: number, event: MouseEvent<HTMLElement>) => void;
    /** Whether to show captions */
    showCaptions?: boolean;
    /** Additional CSS class */
    className?: string;
    /** Custom styles */
    style?: CSSProperties;
    /** Whether images are clickable (cursor pointer) */
    clickable?: boolean;
}
