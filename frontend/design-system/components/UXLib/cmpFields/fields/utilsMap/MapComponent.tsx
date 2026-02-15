import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import { useMap } from './MapProvider';
import { AdvancedMarker } from './AdvancedMarker';
import { CustomControl } from './CustomControl';
import { ControlButton } from './ControlButton';
import { useGeolocation } from './useGeolocation';
import { CmpSvg } from '../../../cmpSvg/CmpSvg';
import { ICONS_FIELD, ICONS_SIZE } from '../../utils';


interface LocationItem {
  lat: number;
  lng: number;
  icon?: string;
  id?: string | number;
  color?: string;
}

interface MapComponentProps {
  id?: string,
  zoom?: number,
  typeGeo?: number,
  setValueGeo?: (value: string | null, name?: string) => void;
  iconMarker?: string;
  drawableElements?: LocationItem[];
  onLocationClick?: (drawableElements: LocationItem) => void;
}



const MapComponent: React.FC<MapComponentProps> = (
  {
    id = 'Maps',
    zoom = 18,
    typeGeo,
    setValueGeo = () => { },
    iconMarker = "",
    drawableElements = [],
    onLocationClick = () => { },

  }
) => {

  const { isLoaded, setMap, loadError, map, center, setCenter } = useMap();
  const {
    position = { lat: 0, lng: 0 },

    getCurrentPosition,

  } = useGeolocation();

  const mapOptions = useMemo<google.maps.MapOptions>(() => ({
    mapId: 'YOUR_MAP_ID',
    disableDefaultUI: true,
    clickableIcons: false,
    zoomControl: true,
    mapTypeControl: true,
    fullscreenControl: true,
    gestureHandling: 'greedy',
    minZoom: 3,
    maxZoom: 18,
    restriction: {
      latLngBounds: {
        north: 85,
        south: -85,
        west: -180,
        east: 180
      },
      strictBounds: false
    }
  }), []);

  useEffect(() => {
    getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 5000
    });
  }, []);

  useEffect(() => {
    if (position) {

      const newCenter: google.maps.LatLngLiteral = {
        lat: position.lat, // lat() siempre devuelve number
        lng: position.lng  // lng() siempre devuelve number
      };
      setCenter(newCenter);
    }
  }, [position]);

  useEffect(() => {
    const value = `${center.lat}, ${center.lng}`
    setValueGeo(value)
  }, [center, position])


  if (!isLoaded) return <div className="map-loading">Cargando mapa...</div>;
  if (loadError) return <div className="map-error">Error al cargar el mapa</div>;


  const [iconMap, setIconMap] = useState(iconMarker)
  const dragMarket = () => {
    setIconMap(ICONS_FIELD.MAP_ICO_WATCH_POSITION);
    dragMap();

  }

  const dragMarketEnd = () => {
    setIconMap(ICONS_FIELD.MAP_ICO_PIN);
    dragMap();


  }

  const currentTarget = () => {
    getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 5000
    });
  }


  const dragMap = useCallback(() => {

    if (!map) return;

    const currentCenter = map.getCenter();
    if (!currentCenter) return;

    const newCenter: google.maps.LatLngLiteral = {
      lat: currentCenter.lat(), // lat() siempre devuelve number
      lng: currentCenter.lng()  // lng() siempre devuelve number
    };
    const value = `${currentCenter.lat()}, ${currentCenter.lng()}`

    // Actualizar el estado del centro
    setCenter(newCenter);
    setValueGeo(String(value))


  }, [[map, setCenter]]);

  return (
    <GoogleMap
      mapContainerStyle={{
        width: '100%', height: '100%', minHeight: "420px",
        borderRadius: "4px",
      }}
      center={position !== null ? position : undefined}
      zoom={17}
      options={mapOptions}
      onLoad={(mapInstance: google.maps.Map) => setMap(mapInstance)}
      onUnmount={() => setMap(null)}
      onDrag={dragMarket}
      onDragEnd={dragMarketEnd}
    >
      <>
        <AdvancedMarker position={center !== undefined ? center : position !== null ? position : { lat: 0, lng: 0 }}>
          <div className="custom-marker">
            <CmpSvg
              icon={iconMap}
              fontSize={ICONS_SIZE.LARGE}
              color='red'
            />
          </div>
        </AdvancedMarker>
        {drawableElements.length > 0 &&
          drawableElements.map((loc, i) => (
            <AdvancedMarker key={loc.id || i} position={{ lat: loc.lat, lng: loc.lng }} onClick={() => onLocationClick?.(loc)}>
              <div className="custom-marker">
                <CmpSvg
                  icon={loc.icon || ICONS_FIELD.MAP_ICO_PIN}
                  fontSize={ICONS_SIZE.LARGE}
                  color={loc.color || 'blue'}
                />
              </div>
            </AdvancedMarker>
          ))
        }
        <CustomControl position='RIGHT_CENTER'>
          <ControlButton onClick={currentTarget} >
            <CmpSvg
              icon={ICONS_FIELD.MAP_TARGET_CURRENT_POSITION}
              fontSize={ICONS_SIZE.MEDIUM}
              color='black'
              cursor='pointer'
            />
          </ControlButton>
        </CustomControl>
      </>
    </GoogleMap>
  );
};

export default MapComponent;