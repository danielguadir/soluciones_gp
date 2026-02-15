import React, { useState, useEffect, useCallback } from "react";
import { CmpFieldLabel } from "./CmpFieldLabel";
import { ICONS_FIELD, ICONS_SIZE } from "../utils";
import { MapProvider } from "./utilsMap/MapProvider";
import MapComponent from "./utilsMap/MapComponent";
import { Svg as CmpSvg } from "../../Svg/Svg";
import { Button as CmpButton } from "../../Button/Button";

// Configuración de tipos
type GeoPosition = {
  lat: number;
  lng: number;
  acc?: number;
  center?: { lat: number; lng: number };
  value?: string;
};

type CmpFieldLocationProps = {
  id?: string;
  label?: string | undefined;
  value?: string;
  reference?: React.RefObject<HTMLInputElement>;
  template?: string;
  disabled?: boolean;
  autoComplete?: string;
  iconSelect?: string;
  iconClr?: string;
  zoom?: number;
  typeGeo?: number;
  readOnly?: boolean;
  mandatory?: boolean;
  onChange: (value: string) => void;
};

const TYPE_GEO = { TRACKEO: 0, CURRENTPOSITION: 1 };

export const CmpFieldLocation: React.FC<CmpFieldLocationProps> = ({
  id = "gps",
  label,
  value = "",
  disabled = false,
  typeGeo = TYPE_GEO.CURRENTPOSITION,
  zoom = 19,
  readOnly = false,
  onChange = () => { },
  template,
  iconClr = "",
  iconSelect,
  mandatory = false,
}) => {
  const [labelFocus, setLabelFocus] = useState(false);
  const [hasFocusStyle, setHasFocusStyle] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [propsGeo, setPropsGeo] = useState<GeoPosition | null>(null);
  const [valueGeo, setValueGeo] = useState<string | null>(value);

  useEffect(() => {
    if (valueGeo !== value) {
      onChange(valueGeo || "");
    }
  }, [valueGeo]);

  // Manejar eventos de focus
  const handleFocusEvents = (event: React.FocusEvent | React.MouseEvent) => {
    const typeFocus = event.type;

    if (typeFocus === "click") {
      setShowMap((prev) => !prev);
      setLabelFocus(true);
      setHasFocusStyle(true);
    }

    if (typeFocus === "blur") {
      setLabelFocus(!!propsGeo?.value);
      setHasFocusStyle(false);
    }
  };

  return (
    <MapProvider>
      <div className="field-location-container">
        <div
          className="divFieldInput"
          onClick={handleFocusEvents}
          onBlur={handleFocusEvents}
        >
          <CmpFieldLabel
            labelFocus={labelFocus}
            id={id}
            label={label}
            template={template}
          />
          <div
            className={`cmpInputBase-root cmpInput-root cmpInputBase-fullWidth cmpInput-formCtrl cmpInput-underline ${hasFocusStyle
              ? "cmpInput-underline-focusAF"
              : "cmpInput-underline-focusOFF"
              } ${hasError ? "cmpInput-underline-focus-error" : ""}`}
            style={
              template === "outlined"
                ? {
                  border: "1px solid #80808078",
                  borderRadius: "5px",
                  paddingRight: "5px",
                }
                : {}
            }
          >
            <input
              className="cmpInputBase-input cmpInput-input"
              style={
                template === "outlined" ? { padding: "7px 37px 7px 10px" } : {}
              }
              id={id}
              type="text"
              value={valueGeo || ""}
              placeholder={label}
              disabled={disabled}
              readOnly={readOnly}
              aria-invalid={hasError}
              required={mandatory}
            />
            <div
              className="cmpInput-adorment-root cmpInput-adorment-positionStart"
              onClick={() => setShowMap((prev) => !prev)}
            >
              <CmpSvg
                icon={iconSelect ? iconSelect : ICONS_FIELD.MAP_ICO_LOCATION}
                fontSize={ICONS_SIZE.MEDIUM}
                color={
                  !valueGeo
                    ? "var(--clr-error)"
                    : iconClr
                      ? iconClr
                      : "var(--primary-color)"
                }
                style={{ marginInlineEnd: "-5pt", padding: "0pt 0pt 5pt 0pt" }}
                onClick={() => setShowMap((prev) => !prev)}
                cursor={"pointer"}
              />
            </div>
          </div>
        </div>

        {showMap && (
          <div className="map-modal">
            <MapComponent
              id={id}
              zoom={zoom}
              typeGeo={typeGeo}
              setValueGeo={setValueGeo}
            />
            <CmpButton
              className="buttonBase-root button-root button-outlined button-outlinedPrimary"
              onClick={() => setShowMap(false)}
              nameBtn="Cerrar"
            />
          </div>
        )}
      </div>
    </MapProvider>
  );
};
