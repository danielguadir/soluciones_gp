import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
// import "./Tooltip.css";

const Tooltip = ({ children, content, position = "top" }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="tooltip-container">
      <div
        className="tooltip-trigger"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div className={`tooltip-content tooltip-${position}`}>{content}</div>
      )}
    </div>
  );
};

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  content: PropTypes.string.isRequired,
  position: PropTypes.oneOf(["top", "bottom", "left", "right"]),
};

const MovingTooltip = ({
  value,
  position,
  isVisible,
  bckClr = "#fff",
  brdClr,
  fontClr = "var(--primary-color)",
}) => {
  const tooltipRef = useRef(null);
  const [adjustedPosition, setAdjustedPosition] = useState(position);

  useEffect(() => {
    // Ajustar posición para que no salga de la pantalla
    if (tooltipRef.current) {
      const tooltipWidth = tooltipRef.current.offsetWidth;
      const tooltipHeight = tooltipRef.current.offsetHeight;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      let newX = position.x - 3;
      let newY = position.y - 10;

      // Ajuste horizontal
      if (position.x + tooltipWidth > windowWidth) {
        newX = windowWidth - tooltipWidth - 8;
      } else if (position.x < 0) {
        newX = 10;
      }

      // Ajuste vertical (opcional)
      if (position.y + tooltipHeight > windowHeight) {
        newY = windowHeight - tooltipHeight - 10;
      } else if (position.y < 0) {
        newY = 10;
      }

      setAdjustedPosition({ x: newX, y: newY });
    }
  }, [position]);

  if (!isVisible) return null;

  return (
    <div
      ref={tooltipRef}
      className="moving-tooltip"
      style={{
        left: `${adjustedPosition.x}px`,
        top: `${adjustedPosition.y}px`,
        transform: "translate(-50%, -100%)",
        "--comp-tooltip-bkgClr": `${
          [undefined, null, ""].includes(bckClr)
            ? "var(--primary-color)"
            : bckClr
        }`,
        "--comp-tooltip-fontClr": `${
          [undefined, null, ""].includes(fontClr) ? "#fff" : fontClr
        }`,
        "--comp-tooltip-borderClr": `${
          [undefined, null, ""].includes(brdClr)
            ? "var(--primary-color)"
            : brdClr
        }`,
      }}
    >
      <div className="tooltip-arrow-content"></div>
      <div className="tooltip-content-moving">{value}</div>
    </div>
  );
};

MovingTooltip.propTypes = {
  value: PropTypes.string.isRequired,
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  isVisible: PropTypes.bool.isRequired,
  bckClr: PropTypes.string,
  fontClr: PropTypes.string,
};

export { Tooltip, MovingTooltip };
