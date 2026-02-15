"use client";
import React, { useEffect, useRef } from 'react';
import { useGoogleMap } from '@react-google-maps/api';

interface AdvancedMarkerProps {
  position: google.maps.LatLngLiteral;
  children?: React.ReactNode;
  onClick?: (e: google.maps.MapMouseEvent) => void;
  gmpDraggable?: boolean;
}

const AdvancedMarker: React.FC<AdvancedMarkerProps> = ({
  position,
  children,
  onClick,
  gmpDraggable = false
}) => {
  const map = useGoogleMap();
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!map || !window.google?.maps?.marker?.AdvancedMarkerElement || !contentRef.current) return;

    // Crear contenedor para el marcador
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.transform = 'translate(-50%, -100%)'; // Ajuste clave

    // Clonar el contenido children
    const content = contentRef.current.cloneNode(true);
    container.appendChild(content);

    // Crear el marcador
    markerRef.current = new google.maps.marker.AdvancedMarkerElement({
      map,
      position,
      content: container,
      gmpDraggable
    });

    // Evento click
    if (onClick) {
      markerRef.current.addListener('click', onClick);
    }

    return () => {
      if (markerRef.current) {
        google.maps.event.clearInstanceListeners(markerRef.current);
        markerRef.current.map = null;
      }
    };
  }, [map, gmpDraggable, onClick]);

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.position = position;
    }
  }, [position]);

  return (
    <div
      ref={contentRef}
      style={{
        display: 'inline-block',
        //     backgroundColor: '#4285F4',
        //   color: 'white',
        padding: '8px',
        borderRadius: '50%',
        //    border: '2px solid white',
        //     boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        zIndex: 1000,
      }}
    >
      {children || '📍'} {/* Fallback por si no hay children */}
    </div>
  );
};

export { AdvancedMarker };