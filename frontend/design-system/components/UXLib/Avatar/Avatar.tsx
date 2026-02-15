import React, { useState } from "react";
import { Svg } from "../Svg/Svg";
import type { AvatarProps } from "./Avatar.types";
import "../styles/cmpStyles.scss";

export const Avatar: React.FC<AvatarProps> = ({
    id,
    src,
    alt = "",
    name,
    icon,
    size = "md",
    shape = "circle",
    color,
    className = "",
    style = {},
    onClick
}) => {
    const [hasError, setHasError] = useState(false);

    const getInitials = (userName?: string) => {
        if (!userName) return "";
        const names = userName.trim().split(" ");
        if (names.length === 1) return names[0].charAt(0).toUpperCase();
        return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    };

    const getAvatarSizeStyle = (): React.CSSProperties => {
        if (typeof size === "number") {
            return { width: `${size}px`, height: `${size}px`, fontSize: `${size / 2.5}px` };
        }
        return {};
    };

    const avatarStyle: React.CSSProperties = {
        ...style,
        ...getAvatarSizeStyle(),
        ...(color ? { backgroundColor: color } : {})
    };

    const sizeClass = typeof size === "string" ? `avatar--${size}` : "";
    const shapeClass = `avatar--${shape}`;

    const renderContent = () => {
        if (src && !hasError) {
            return (
                <img
                    src={src}
                    alt={alt || name || "avatar"}
                    className="avatar-img"
                    onError={() => setHasError(true)}
                />
            );
        }

        if (name) {
            return <span className="avatar-initials">{getInitials(name)}</span>;
        }

        if (icon) {
            return <Svg icon={icon} fontSize="inherit" className="avatar-icon" />;
        }

        return <Svg icon="user" fontSize="inherit" className="avatar-icon" />;
    };

    return (
        <div
            id={id}
            className={`ux-avatar ${sizeClass} ${shapeClass} ${className}`}
            style={avatarStyle}
            onClick={onClick}
            role={onClick ? "button" : "img"}
            tabIndex={onClick ? 0 : undefined}
        >
            {renderContent()}
        </div>
    );
};
