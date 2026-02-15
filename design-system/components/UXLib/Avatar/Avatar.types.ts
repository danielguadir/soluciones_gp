import React from "react";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | number;
export type AvatarShape = "circle" | "rounded" | "square";

export interface AvatarProps {
  id?: string;
  src?: string;
  alt?: string;
  name?: string;
  icon?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}
