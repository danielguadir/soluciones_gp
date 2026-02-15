"use client";
import React, { useRef, type MouseEvent } from "react";
import { Svg } from "../Svg/Svg";
import type { ButtonProps } from "./Button.types";

export const Button: React.FC<ButtonProps> = ({
  id,
  onClick,
  style = {},
  className = "",
  color,
  variant = "contained",
  disabled = false,
  nameBtn = "",
  iconPosition,
  icon,
  iconSize,
  type = "button",
  cursor = "default",
  radius,
  role = "button"
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const styleBtn: React.CSSProperties = {
    ...style,
    ...(color ? { "--btn-bg-color": color } as React.CSSProperties : {}),
    ...(radius ? { "--btn-radius": radius } as React.CSSProperties : {})
  };

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    createRipple(event);
    if (onClick) {
      onClick(event);
    }
  };

  const createRipple = (event: MouseEvent<HTMLButtonElement>) => {
    const button = buttonRef.current;
    if (!button) return;

    const buttonWidth = button.offsetWidth;
    const buttonHeight = button.offsetHeight;
    const diameter = Math.sqrt(buttonWidth * buttonWidth + buttonHeight * buttonHeight);

    const circle = document.createElement('span');
    circle.style.width = circle.style.height = `${diameter}px`;

    const rect = button.getBoundingClientRect();
    circle.style.left = `${event.clientX - rect.left - diameter / 2}px`;
    circle.style.top = `${event.clientY - rect.top - diameter / 2}px`;

    circle.classList.add('ripple');

    const ripples = button.getElementsByClassName('ripple');
    for (let i = 0; i < ripples.length; i++) {
      ripples[i].remove();
    }

    button.appendChild(circle);

    setTimeout(() => {
      circle.remove();
    }, 600);
  };

  return (
    <button
      id={id}
      onClick={handleClick}
      ref={buttonRef}
      type={type}
      className={`btn btn--${variant} ${className}`}
      disabled={disabled}
      style={styleBtn}
      role={role}
      aria-label={id ? `Btn-${id}` : "button"}
    >
      {iconPosition === "center" && icon ? (
        <Svg
          icon={icon}
          className={`btn-icon--${iconPosition}`}
          fontSize={iconSize}
          cursor={cursor}
        />
      ) : (
        <>
          {iconPosition === "left" && icon && (
            <Svg
              icon={icon}
              className={`btn-icon--${iconPosition}`}
              fontSize={iconSize}
              cursor={cursor}
            />
          )}
          {nameBtn && <span>{nameBtn}</span>}
          {iconPosition === "right" && icon && (
            <Svg
              icon={icon}
              className={`btn-icon--${iconPosition}`}
              fontSize={iconSize}
              cursor={cursor}
            />
          )}
        </>
      )}
    </button>
  );
};