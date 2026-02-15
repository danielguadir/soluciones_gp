import React, { MouseEvent } from 'react';

interface ControlButtonProps {
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}

const ControlButton: React.FC<ControlButtonProps> = ({ onClick, children }) => {
  return (
    <button
    onClick={onClick}
    style={{
      backgroundColor: "#fff",
      border: "2px solid #fff",
      borderRadius: "3px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
      cursor: "pointer",
      margin: "10px",
      fontSize: "14px",
      fontWeight: "bold",
      height: "40px",
      width: "40px",
      display: 'grid',
    justifyContent: 'center',
    alignContent: 'center'
    }}
    >
      {children}
    </button>
  )
}

export {ControlButton}