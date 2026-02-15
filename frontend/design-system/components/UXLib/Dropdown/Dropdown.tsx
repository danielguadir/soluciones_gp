import React, { useState, useRef, useEffect } from "react";
import { Svg } from "../Svg/Svg";
import type { DropdownProps } from "./Dropdown.types";

export const Dropdown: React.FC<DropdownProps> = ({
    id,
    trigger,
    options,
    className = "",
    align = "right"
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleOptionClick = (option: any) => {
        if (option.disabled) return;
        option.onClick();
        setIsOpen(false);
    };

    return (
        <div id={id} className={`dropdown ${className}`} ref={dropdownRef}>
            <div className="dropdown__trigger" onClick={toggleDropdown}>
                {trigger || (
                    <button className="dropdown__trigger-btn" aria-label="More options">
                        <Svg icon="ellipsis-vert" fontSize="16px" />
                    </button>
                )}
            </div>

            {isOpen && (
                <div className={`dropdown__menu dropdown__menu--align-${align}`}>
                    {options.map((option, index) => (
                        <div
                            key={index}
                            className={`dropdown__item dropdown__item--${option.variant || "default"} ${option.disabled ? 'dropdown__item--disabled' : ''}`}
                            onClick={() => handleOptionClick(option)}
                        >
                            {option.icon && (
                                <span className="dropdown__item-icon">
                                    <Svg icon={option.icon} fontSize="14px" />
                                </span>
                            )}
                            <span className="dropdown__item-label">{option.label}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
