import type { CSSProperties, MouseEvent } from "react";
import "../styles/cmpStyles.scss";
import type { GalleryProps, GalleryItem } from "./Gallery.types";

export const Gallery = ({
    id,
    items,
    columns = 3,
    gap = "1rem",
    aspectRatio = "1:1",
    onItemClick,
    showCaptions = false,
    className = "",
    style = {},
    clickable,
}: GalleryProps) => {
    const isClickable = clickable ?? !!onItemClick;

    const galleryStyle: CSSProperties = {
        "--gallery-columns": typeof columns === "number" ? columns : "auto-fill",
        "--gallery-gap": gap,
        ...style,
    } as CSSProperties;

    const handleItemClick = (item: GalleryItem, index: number, event: MouseEvent<HTMLElement>) => {
        if (onItemClick) {
            onItemClick(item, index, event);
        }
    };

    const handleKeyDown = (item: GalleryItem, index: number, event: React.KeyboardEvent<HTMLElement>) => {
        if (isClickable && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            onItemClick?.(item, index, event as unknown as MouseEvent<HTMLElement>);
        }
    };

    const getAspectRatioClass = () => {
        switch (aspectRatio) {
            case "1:1": return "gallery--ratio-1-1";
            case "4:3": return "gallery--ratio-4-3";
            case "16:9": return "gallery--ratio-16-9";
            default: return "gallery--ratio-auto";
        }
    };

    return (
        <div
            id={id}
            className={`gallery ${getAspectRatioClass()} ${className}`}
            style={galleryStyle}
            role="list"
            aria-label={id ? `gallery-${id}` : "Image gallery"}
        >
            {items.map((item, index) => (
                <figure
                    key={item.id ?? index}
                    className={`gallery__item ${isClickable ? "gallery__item--clickable" : ""}`}
                    onClick={isClickable ? (e) => handleItemClick(item, index, e) : undefined}
                    onKeyDown={isClickable ? (e) => handleKeyDown(item, index, e) : undefined}
                    role="listitem"
                    tabIndex={isClickable ? 0 : undefined}
                >
                    <div className="gallery__image-wrapper">
                        <img
                            src={item.thumbnail || item.src}
                            alt={item.alt || ""}
                            className="gallery__image"
                            loading="lazy"
                        />
                    </div>
                    {showCaptions && item.caption && (
                        <figcaption className="gallery__caption">
                            {item.caption}
                        </figcaption>
                    )}
                </figure>
            ))}
        </div>
    );
};
