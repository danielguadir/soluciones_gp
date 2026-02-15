import type { CSSProperties, MouseEvent } from "react";

export interface SvgProps {
  id?: string;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  icon: string;
  fontSize?: string | number;
  color?: string;
  style?: CSSProperties;
  className?: string;
  cursor?: string;
  title?: string;
  role?: string;
  ariaLabel?: string;
}
