"use client";
import React, {
  useState,
  useEffect,
  useRef,
  FocusEvent,
  MouseEvent,
} from "react";
import { CmpFieldLabel } from "./CmpFieldLabel";
import { ICONS_FIELD, ICONS_SIZE } from "../utils";
import { Modal } from "../../Modal/Modal";
import { CmpListSvg } from "../../cmpListSvg/CmpListSvg";
import { Svg as CmpSvg } from "../../Svg/Svg";
import { Button as CmpButton } from "../../Button/Button";

type InputTemplate = "outlined" | string;

interface CmpFieldTextProps {
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
  iconString?: string;
  iconSelect?: string;
  iconClr?: string;
  size?: string;
}


export const CmpFieldAvatar: React.FC<CmpFieldTextProps> = ({
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
  iconString = "",
  iconSelect = "",
  iconClr = "",
  size = '111px',
}) => {
  const [labelFocus, setLabelFocus] = useState(false);
  const [labFocStyle, setLabFocStyle] = useState(false);
  const [styleError, setStyleError] = useState(false);
  const [avatar, setAvatar] = useState(value);
  const [showModal, setShowModal] = useState(false);
  const [showIcon, setIcon] = useState(false);
  const [val, setVal] = useState(value);
  const inputRef = useRef<HTMLDivElement>(null);
  let getNameAvatar = avatar;

  const handleFocusEvent = (event: FocusEvent | MouseEvent) => {

    const typeFocus = event.type;

    if (typeFocus === "click") {
      if (value === "" && !labelFocus && !labFocStyle) {
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
    setVal("")
    setAvatar('')
  };

  const setnameAvatar = (nameAvatar: string) => {
    getNameAvatar = nameAvatar;
  }

  const onSubmit = () => {
    setAvatar(getNameAvatar);
    onChange(getNameAvatar);
    setVal(getNameAvatar)
    setShowModal(false);

  }

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

  const hasIconString = iconString && iconString?.trim() !== "";

  const iconColor = styleError
    ? "var(--clr-error)"
    : iconClr?.trim() !== ""
      ? iconClr
      : "var(--clr-default)";

  return (
    <div style={{ display: 'flex', flexDirection: "column", alignItems: "center" }}>
      {showIcon &&
        <div className={"avatar-icon"} style={avatar === '' ? { display: 'flex', justifyContent: "center", background: "#cacaca", width: size, height: size, borderRadius: "50%" } : {}} >

          <CmpSvg
            icon={avatar}
            fontSize={size}
            color="var(--primary-color)"
            onClick={() => setIcon(!showIcon)}
            title={avatar}
          />
        </div>
      }
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
          {avatar && (
            <>
              <CmpSvg
                onClick={() => setIcon(!showIcon)}
                icon={avatar || ""}
                fontSize={ICONS_SIZE.MEDIUM}
                color={"var(--primary-color)"}
                style={{ marginLeft: "6pt" }}
              />
              {hasIconString && (
                <div className="cmpFieldTextBtn-str">{iconString}</div>
              )}
            </>
          )}

          <input
            className="cmpInputBase-input cmpInput-input"
            style={{ padding: "5px 22px 7px 10px" }}
            id={id}
            ref={reference}
            type={type}
            value={val}
            placeholder={label}
            disabled={disabled}
            autoComplete={autoComplete}
            aria-invalid={true}
            maxLength={maxIntStr}
            min="0"
            required={mandatory}
            readOnly={true}
            onClick={() => setShowModal(!showModal)}
            onChange={(e) => onChange(e.target.value, e)}
          />

          <div className="cmpInput-adorment-root cmpInput-adorment-positionStart">

            <CmpSvg
              onClick={() => setShowModal(!showModal)}
              icon={iconSelect || "th-list-1"}
              fontSize={ICONS_SIZE.MEDIUM}
              color={iconColor}
              style={{ marginRight: "4px" }}
              cursor="pointer"
            />


            {val && (
              <CmpSvg
                onClick={cleanInput}
                icon={ICONS_FIELD.CANCEL}
                fontSize={ICONS_SIZE.SMALL}
                color="var(--clr-default)"
                cursor="pointer"
                style={{ position: "absolute", right: "33px" }
                }
              />
            )}
          </div>
        </div>
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Iconos"
          onConfirm={onSubmit}
          confirmText="Enviar"
          onCancel={() => setShowModal(false)}
          cancelText="Cancelar"
          closeOnOverlayClick={true}
          className="modal-filter-crud"
          style={{ width: "88%", backgroundColor: "#FFF" }}
        >
          {<CmpListSvg nameSvg={setnameAvatar} svgDefault={avatar} />}
        </Modal>
      </div>
    </div>

  );
};
