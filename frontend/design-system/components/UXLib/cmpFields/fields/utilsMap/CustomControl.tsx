import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useGoogleMap } from '@react-google-maps/api';

interface CustomControlProps {
  position: keyof typeof google.maps.ControlPosition;
  children: React.ReactNode;
}

const CustomControl: React.FC<CustomControlProps> = ({ position, children }) => {
  const map = useGoogleMap();
  const controlDivRef = useRef<HTMLDivElement>(document.createElement("div"));

  useEffect(() => {
    if (!map || !controlDivRef.current) return;

    // Convertimos el string position al enum de ControlPosition
    const controlPosition = google.maps.ControlPosition[position];
    map.controls[controlPosition].push(controlDivRef.current);

    return () => {
      if (map && controlDivRef.current) {
        const controls = map.controls[controlPosition];
        const index = controls.getArray().indexOf(controlDivRef.current);
        if (index !== -1) {
          controls.removeAt(index);
        }
      }
    };
  }, [map, position]);

  if (!controlDivRef.current) return null;

  return ReactDOM.createPortal(children, controlDivRef.current);
}

export { CustomControl };