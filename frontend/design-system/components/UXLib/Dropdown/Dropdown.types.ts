import { ReactNode } from "react";

export interface DropdownOption {
    label: string;
    icon?: string;
    onClick: () => void;
    variant?: "default" | "danger" | "warning";
    disabled?: boolean;
}

export interface DropdownProps {
    id?: string;
    trigger?: ReactNode;
    options: DropdownOption[];
    className?: string;
    align?: "left" | "right";
}
