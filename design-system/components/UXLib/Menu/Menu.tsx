import React, { useState } from "react";
import { Svg } from "../Svg/Svg";
import { Avatar } from "../Avatar/Avatar";
import type { MenuProps, MenuItem } from "./Menu.types";
import "../styles/cmpStyles.scss";

export const Menu: React.FC<MenuProps> = ({
    id,
    logoUrl,
    brandName = "IP TOTAL ZHD",
    items,
    secondaryItems,
    user,
    expanded = true,
    onToggleExpand,
    className = "",
    style = {}
}) => {
    const [openAccordions, setOpenAccordions] = useState<string[]>([]);

    const toggleAccordion = (id: string) => {
        setOpenAccordions((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleToggle = () => {
        if (onToggleExpand) {
            onToggleExpand(!expanded);
        }
    };

    const renderItem = (item: MenuItem) => {
        const hasSubItems = item.subItems && item.subItems.length > 0;
        const isAccordionOpen = openAccordions.includes(item.id);

        return (
            <div key={item.id} className={`menu-item-container ${item.active ? "active" : ""}`}>
                <div
                    className={`menu-item ${item.active ? "active" : ""}`}
                    onClick={() => {
                        if (hasSubItems && expanded) {
                            toggleAccordion(item.id);
                        } else if (item.onClick) {
                            item.onClick();
                        }
                    }}
                    title={!expanded ? item.label : ""}
                >
                    <div className="menu-item-icon">
                        <Svg icon={item.icon} fontSize="20px" />
                    </div>
                    {expanded && (
                        <>
                            <span className="menu-item-label">{item.label}</span>
                            {item.badge && <span className="menu-item-badge">{item.badge}</span>}
                            {hasSubItems && (
                                <div className={`menu-item-arrow ${isAccordionOpen ? "open" : ""}`}>
                                    <Svg icon="angle-down" fontSize="14px" />
                                </div>
                            )}
                        </>
                    )}
                </div>

                {expanded && hasSubItems && isAccordionOpen && (
                    <div className="menu-subitems">
                        {item.subItems?.map((sub) => (
                            <div
                                key={sub.id}
                                className={`menu-subitem ${sub.active ? "active" : ""}`}
                                onClick={sub.onClick}
                            >
                                {sub.label}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <aside
            id={id}
            className={`menu-sidebar ${expanded ? "expanded" : "collapsed"} ${className}`}
            style={style}
        >
            <div className="menu-header">
                <div className="menu-logo-container">
                    {logoUrl ? (
                        <img src={logoUrl} alt="Logo" className="menu-logo" />
                    ) : (
                        <div className="menu-logo-placeholder"></div>
                    )}
                    {expanded && <span className="menu-brand-name">{brandName}</span>}
                </div>
                <button className="menu-toggle-btn" onClick={handleToggle} aria-label="Toggle Menu">
                    <Svg icon={expanded ? "left-open" : "right-open"} fontSize="16px" />
                </button>
            </div>

            <div className="menu-body">
                <nav className="menu-nav">
                    {items.map((item) => renderItem(item))}
                </nav>
            </div>

            <div className="menu-footer">
                {secondaryItems && secondaryItems.length > 0 && (
                    <nav className="menu-nav-secondary">
                        <div className="menu-separator" />
                        {secondaryItems.map((item) => renderItem(item))}
                    </nav>
                )}

                {user && (
                    <div className="menu-user-profile">
                        <Avatar
                            src={user.avatar}
                            name={user.name}
                            size={expanded ? 40 : 32}
                            shape="circle"
                            className="menu-user-avatar"
                        />
                        {expanded && (
                            <div className="menu-user-info">
                                <span className="menu-user-name">{user.name}</span>
                                <span className="menu-user-email">{user.email}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </aside>
    );
};
