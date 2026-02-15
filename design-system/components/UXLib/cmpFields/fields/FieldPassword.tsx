"use client";
import React, { useState, useEffect, useRef } from "react";
import { CmpFieldLabel } from "./CmpFieldLabel";
import { Svg as CmpSvg } from "../../Svg/Svg";
import { ICONS_FIELD, ICONS_SIZE } from "../utils";

interface FieldPasswordProps {
  readOnly?: boolean;
  id?: string;
  label: string;
  value?: string;
  maxIntStr?: number;
  mandatory?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  reference?: React.RefObject<HTMLInputElement>;
  onChange: (value: string | null | undefined, textField: any) => void;
  template?: string;
  iconPosition?: "right" | "left" | "Right" | "Left" | "RIGHT" | "LEFT";
  iconString?: string;
  iconSelect?: string;
  iconClr?: string;
  // Nueva prop para el icono que reemplazará los puntos
  //  passwordCharIcon?: string; // Nombre del icono a usar
}

const ICO_POSITION = {
  RIGHT: ["right", "Right", "RIGHT"],
  LEFT: ["left", "Left", "LEFT"],
} as const;

export const FieldPassword: React.FC<FieldPasswordProps> = ({
  id,
  label,
  value = "",
  maxIntStr,
  mandatory = false,
  disabled = false,
  autoComplete = "off",
  reference,
  onChange = () => { },
  template,
  iconPosition = "right",
  iconString,
  iconSelect = "",
  iconClr = "",
  readOnly = false,
  //  passwordCharIcon = ICONS_FIELD.LOCK, // Icono por defecto
}) => {
  const [labelFocus, setLabelFocus] = useState(false);
  const [labFocStyle, setLabFocStyle] = useState(false);
  const [styleError, setStyleError] = useState(false);
  const [show, setShow] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = (event: React.FocusEvent | React.MouseEvent) => {
    const typeFocus = event.type;

    if (typeFocus === "click") {
      if (value === "" && labelFocus && labFocStyle) {
        setLabelFocus(false);
      } else {
        setLabelFocus(true);
        setLabFocStyle(true);
      }
    }
  };

  const handleBlur = () => {
    if (value === "") {
      setLabelFocus(false);
      setLabFocStyle(false);
    }
    if (value !== "") {
      setLabFocStyle(false);
    }
  };

  const cleanInput = () => {
    onChange("", "");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };


  useEffect(() => {
    if (value === "" && mandatory) {
      setStyleError(true);
    } else if (value !== "" && mandatory) {
      setStyleError(false);
    }

    if (value !== "" && !labelFocus) {
      setLabelFocus(true);
    }
  }, [value, labelFocus, mandatory]);

  return (
    <div className="divFieldInput">
      <CmpFieldLabel
        labelFocus={labelFocus}
        id={id}
        label={label}
        template={template}
      />
      <div
        className={`cmpInputBase-root cmpInput-root cmpInputBase-fullWidth cmpInput-formCtrl cmpInput-underline cpmField-password ${labFocStyle
          ? "cmpInput-underline-focusAF"
          : "cmpInput-underline-focusOFF"
          } ${styleError ? "cmpInput-underline-focus-error" : ""}`}
        style={
          template === "outlined"
            ? {
              border: "1px solid #80808078",
              borderRadius: "5px",
            }
            : {}
        }
        onBlur={handleBlur}
        onClick={handleFocus}
      >
        {ICO_POSITION.LEFT.includes(iconPosition as any) && (
          <>
            <CmpSvg
              onClick={handleFocus}
              icon={iconSelect || ""}
              fontSize={ICONS_SIZE.MEDIUM}
              color={
                styleError
                  ? "var(--clr-error)"
                  : iconClr || "var(--clr-default)"
              }
            />
            <CmpSvg
              icon={show ? ICONS_FIELD.EYE : ICONS_FIELD.EYE_OFF}
              onClick={(e) => {
                e.stopPropagation();
                setShow(!show);
              }}
              fontSize={ICONS_SIZE.SMALL}
              cursor="pointer"
              color="var(--primary-color)"
              style={{ position: "absolute", right: "1px" }}
            />
            {iconString && (
              <div className="cmpFieldTextBtn-str">{iconString}</div>
            )}
          </>
        )}

        <input
          className="cmpInputBase-input cmpInput-input"
          style={{ padding: "7px 52px 7px 5px" }}
          id={id}
          ref={reference || inputRef}
          type={show ? "text" : "password"}
          value={value}
          placeholder={labelFocus ? "" : label}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-invalid={styleError ? true : false}
          maxLength={maxIntStr}
          min="0"
          required={mandatory}
          onChange={(e) => onChange(e.target.value, e as any)}
          readOnly={readOnly}
        />

        <div className="cmpInput-adorment-root cmpInput-adorment-positionStart">
          {ICO_POSITION.RIGHT.includes(iconPosition as any) && (
            <>
              <CmpSvg
                onClick={handleFocus}
                icon={iconSelect || ""}
                fontSize={ICONS_SIZE.SMALL}
                color={
                  styleError
                    ? "var(--clr-error)"
                    : iconClr || "var(--clr-default)"
                }
              />

              <CmpSvg
                icon={show ? ICONS_FIELD.EYE : ICONS_FIELD.EYE_OFF}
                onClick={(e) => {
                  e.stopPropagation();
                  setShow(!show);
                }}
                fontSize={ICONS_SIZE.SMALL}
                color="var(--primary-color)"
                cursor="pointer"
                style={
                  !iconSelect
                    ? { position: "absolute", right: "1px" }
                    : { position: "absolute", right: "25px" }
                }
              />
            </>
          )}

          {value && (
            <CmpSvg
              onClick={(e) => {
                e.stopPropagation();
                cleanInput();
              }}
              icon={ICONS_FIELD.CANCEL}
              fontSize={ICONS_SIZE.SMALL}
              color="var(--clr-default)"
              cursor="pointer"
              style={
                iconSelect && ICO_POSITION.RIGHT.includes(iconPosition as any)
                  ? { position: "absolute", right: "45px" }
                  : iconSelect &&
                    ICO_POSITION.LEFT.includes(iconPosition as any)
                    ? { position: "absolute", right: "21px" }
                    : { position: "absolute", right: "24px" }
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};
