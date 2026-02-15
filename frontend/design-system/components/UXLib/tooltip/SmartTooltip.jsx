// SmartTooltipProps
import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import "./SmartTooltip.css";

const SmartTooltip = ({
  content,
  children,
  position = "auto",
  offset = 8,
  backgroundColor = "#333",
  textColor = "#fff",
  fontSize = "0.875rem",
  borderRadius = "4px",
  padding = "8px 12px",
  maxWidth = "200px",
  arrowSize = "5px",
  animationDuration = "200ms",
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [computedPosition, setComputedPosition] = useState(position);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);

  const calculatePosition = () => {
    if (!isVisible || !triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (position !== "auto") {
      setComputedPosition(position);
      updateTooltipPosition(position, triggerRect, tooltipRect);
      return;
    }

    const space = {
      top: triggerRect.top - tooltipRect.height - offset,
      bottom: viewportHeight - triggerRect.bottom - tooltipRect.height - offset,
      left: triggerRect.left - tooltipRect.width - offset,
      right: viewportWidth - triggerRect.right - tooltipRect.width - offset,
    };

    let bestPosition = "top";
    let maxSpace = -Infinity;

    ["top", "bottom", "left", "right"].forEach((dir) => {
      if (space[dir] > maxSpace) {
        maxSpace = space[dir];
        bestPosition = dir;
      }
    });

    setComputedPosition(bestPosition);
    updateTooltipPosition(bestPosition, triggerRect, tooltipRect);
  };

  const updateTooltipPosition = (pos, triggerRect, tooltipRect) => {
    let left, top;

    switch (pos) {
      case "top":
        left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        top = triggerRect.top - tooltipRect.height - offset;
        break;
      case "bottom":
        left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        top = triggerRect.bottom + offset;
        break;
      case "left":
        left = triggerRect.left - tooltipRect.width - offset;
        top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        break;
      case "right":
        left = triggerRect.right + offset;
        top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        break;
      default:
        left = triggerRect.left;
        top = triggerRect.top;
    }

    left = Math.max(
      offset,
      Math.min(left, window.innerWidth - tooltipRect.width - offset)
    );
    top = Math.max(
      offset,
      Math.min(top, window.innerHeight - tooltipRect.height - offset)
    );

    setCoords({ top, left });
  };

  useEffect(() => {
    if (isVisible) {
      calculatePosition();
      window.addEventListener("resize", calculatePosition);
      window.addEventListener("scroll", calculatePosition, true);
    }

    return () => {
      window.removeEventListener("resize", calculatePosition);
      window.removeEventListener("scroll", calculatePosition, true);
    };
  }, [isVisible, content]);

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <div
      className={`tooltip-container ${className}`}
      style={{ display: "inline-block", position: "relative" }}
    >
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ display: "inline-block" }}
      >
        {children}
      </div>

      <div
        ref={tooltipRef}
        className={`tooltip tooltip--${computedPosition} ${
          isVisible ? "tooltip--visible" : ""
        }`}
        style={{
          "--tooltip-bg": backgroundColor,
          "--tooltip-color": textColor,
          "--tooltip-font-size": fontSize,
          "--tooltip-border-radius": borderRadius,
          "--tooltip-padding": padding,
          "--tooltip-max-width": maxWidth,
          "--tooltip-arrow-size": arrowSize,
          "--tooltip-animation-duration": animationDuration,
          top: `${coords.top}px`,
          left: `${coords.left}px`,
        }}
      >
        {content}
      </div>
    </div>
  );
};

SmartTooltip.propTypes = {
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  children: PropTypes.node.isRequired,
  position: PropTypes.oneOf(["auto", "top", "bottom", "left", "right"]),
  offset: PropTypes.number,
  backgroundColor: PropTypes.string,
  textColor: PropTypes.string,
  fontSize: PropTypes.string,
  borderRadius: PropTypes.string,
  padding: PropTypes.string,
  maxWidth: PropTypes.string,
  arrowSize: PropTypes.string,
  animationDuration: PropTypes.string,
  className: PropTypes.string,
};

export default SmartTooltip;
