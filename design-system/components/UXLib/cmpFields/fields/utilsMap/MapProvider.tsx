"use client";
import React, { createContext, useContext, useState } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { GM_MAP_ID, GPS_GM_KEY } from '@/common/config';

// En tu archivo de tipos o donde definas el contexto
type MapState = google.maps.Map | null;
type MapCenter = google.maps.LatLngLiteral; // { lat: number; lng: number }

type MapContextType = {
  isLoaded: boolean;
  loadError: Error | undefined;
  map: MapState | null;
  center: MapCenter;
  setMap: React.Dispatch<React.SetStateAction<MapState | null>>;
  setCenter: React.Dispatch<React.SetStateAction<MapCenter>>;

};



const MapContext = createContext<MapContextType | undefined>(undefined);

export type GoogleMapsLibrary = "marker" | "places" | "geocoding" | "drawing" | "visualization";
const LIBRARIES: GoogleMapsLibrary[] = ["marker", "places", "geocoding"];


export const MapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [map, setMap] = useState<MapState | null>(null);
  const [center, setCenter] = useState<MapCenter>({ lat: 40.416775, lng: -3.703790 });
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GPS_GM_KEY || '',
    libraries: LIBRARIES,
    version: 'beta',
    mapIds: [GM_MAP_ID],
    language: 'es',
    region: 'ES'
  });

  return (
    <MapContext.Provider value={{ isLoaded, loadError, map, setMap, center, setCenter }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMap must be used within a MapProvider');
  }
  return context;
};