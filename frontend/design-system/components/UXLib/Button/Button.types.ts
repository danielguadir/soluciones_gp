import React, { type MouseEvent } from "react";

export type ButtonVariant = "contained" | "outlined" | "text" | "ghost";
export type IconPosition = "left" | "center" | "right";
// export type CssVariables = {
//   [key: `--${string}`]: string;
// };
// 
// export type CmpButtonStyle = React.CSSProperties & CssVariables;

export interface ButtonProps {
  id?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void; //() => void;
  style?: React.CSSProperties;
  className?: string;
  color?: string;
  clrHover?: string;
  clrActive?: string;
  variant?: ButtonVariant;
  disabled?: boolean;
  nameBtn?: string;
  iconPosition?: IconPosition;
  icon?: string;
  iconSize?: string;
  type?: "button" | "submit" | "reset";
  cursor?: string;
  radius?: string;
  role?: string;
}
