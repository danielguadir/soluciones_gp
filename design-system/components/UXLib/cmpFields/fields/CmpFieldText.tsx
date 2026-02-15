"use client";
import React, {
  useState,
  useEffect,
  useRef,
  FocusEvent,
  MouseEvent,
} from "react";
import { CmpFieldLabel } from "./CmpFieldLabel";
import { Svg as CmpSvg } from "../../Svg/Svg";
import { ICONS_FIELD, ICONS_SIZE } from "../utils";

type IconPosition = "left" | "right" | string;
type InputTemplate = "outlined" | string;

interface CmpFieldTextProps {
  readOnly?: boolean;
  id?: string;
  type?: string;
  label?: string;
  value?: string;
  maxIntStr?: number;
  mandatory?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  reference?: React.RefObject<HTMLInputElement>;
  onChange: (
    value: string,
    event?: React.ChangeEvent<HTMLInputElement>
  ) => void;
  template?: InputTemplate;
  iconPosition?: IconPosition;
  iconString?: string;
  iconSelect?: string;
  iconClr?: string;
}

const ICO_POSITION = {
  RIGHT: ["right", "Right", "RIGHT", "rigth", "Rigth", "RIGHT"],
  LEFT: ["left", "Left", "LEFT"],
};

export const CmpFieldText: React.FC<CmpFieldTextProps> = ({
  id,
  type = "text",
  label = "",
  value = "",
  maxIntStr,
  mandatory = false,
  disabled = false,
  autoComplete = "off",
  reference,
  onChange = () => { },
  template,
  iconPosition = "",
  iconString = "",
  iconSelect = "",
  iconClr = "",
  readOnly = false,
}) => {
  const [labelFocus, setLabelFocus] = useState(false);
  const [labFocStyle, setLabFocStyle] = useState(false);
  const [styleError, setStyleError] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);

  const handleFocusEvent = (event: FocusEvent | MouseEvent) => {
    const typeFocus = event.type;

    if (typeFocus === "click") {
      if (value === "" && labelFocus && labFocStyle) {
        setLabelFocus(false);
      } else {
        setLabelFocus(true);
        setLabFocStyle(true);
      }
    }

    if (typeFocus === "blur") {
      if (value === "") {
        setLabelFocus(false);
        setLabFocStyle(false);
      }
      if (value !== "") {
        setLabFocStyle(false);
      }
    }
  };

  const cleanInput = () => {
    onChange("");
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

  const isLeftIcon = ICO_POSITION.LEFT.includes(iconPosition);
  const isRightIcon = ICO_POSITION.RIGHT.includes(iconPosition);
  const hasValue = value;
  const hasIconString = iconString && iconString?.trim() !== "";

  const iconColor = styleError
    ? "var(--clr-error)"
    : iconClr?.trim() !== ""
      ? iconClr
      : "var(--clr-default)";

  return (
    <div className="divFieldInput">
      <CmpFieldLabel
        labelFocus={labelFocus}
        id={id}
        label={label}
        template={template}
      />
      <div
        className={`cmpInputBase-root cmpInput-root cmpInputBase-fullWidth cmpInput-formCtrl cmpInput-underline cmpFieldText ${labFocStyle
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
        onBlur={handleFocusEvent}
        onClick={handleFocusEvent}
        ref={inputRef}
      >
        {isLeftIcon && (
          <>
            <CmpSvg
              onClick={handleFocusEvent}
              icon={iconSelect || ""}
              fontSize={ICONS_SIZE.SMALL}
              color={iconColor}
            />
            {hasIconString && (
              <div className="cmpFieldTextBtn-str">{iconString}</div>
            )}
          </>
        )}

        <input
          className="cmpInputBase-input cmpInput-input"
          style={{ padding: "7px 22px 7px 10px" }}
          id={id}
          ref={reference}
          type={type}
          value={value}
          placeholder={label}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-invalid={true}
          maxLength={maxIntStr}
          min="0"
          required={mandatory}
          readOnly={readOnly}
          onChange={(e) => onChange(e.target.value, e)}
        />

        <div className="cmpInput-adorment-root cmpInput-adorment-positionStart">
          {isRightIcon && (
            <CmpSvg
              onClick={handleFocusEvent}
              icon={iconSelect || ""}
              fontSize={ICONS_SIZE.SMALL}
              color={iconColor}
              style={{ marginRight: "-4px" }}
            />
          )}

          {hasValue && (
            <CmpSvg
              onClick={cleanInput}
              icon={ICONS_FIELD.CANCEL}
              fontSize={ICONS_SIZE.SMALL}
              color="var(--clr-default)"
              cursor="pointer"
              style={
                !iconSelect || isLeftIcon
                  ? { position: "absolute", right: "5px" }
                  : { position: "absolute", right: "21px" }
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};
