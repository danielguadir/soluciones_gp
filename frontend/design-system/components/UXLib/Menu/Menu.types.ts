import React from "react";

export interface SubMenuItem {
  id: string;
  label: string;
  onClick?: () => void;
  active?: boolean;
  subItems?: SubMenuItem[];
}

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  badge?: string | number;
  onClick?: () => void;
  active?: boolean;
  subItems?: SubMenuItem[];
}

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
}

export interface MenuProps {
  id?: string;
  logoUrl?: string;
  brandName?: string;
  items: MenuItem[];
  secondaryItems?: MenuItem[];
  user?: UserProfile;
  expanded?: boolean;
  onToggleExpand?: (expanded: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
}
