import React, {
  useState,
  useEffect,
  useRef,
  MouseEvent,
  FocusEvent,
  ChangeEvent,
} from "react";
import { CmpFieldLabel } from "./CmpFieldLabel";
import { Svg as CmpSvg } from "../../Svg/Svg";
import { Button as CmpButton } from "../../Button/Button";
import { ICONS_FIELD, ICONS_SIZE } from "../utils";

interface CmpFieldSelectProps {
  id?: string;
  label?: string;
  onChange: (value: string | boolean | null, name?: string) => void;
  value?: string;
  reference?: React.RefObject<HTMLInputElement>;
  disabled?: boolean;
  autoComplete?: string;
  maxIntStr?: number;
  mandatory?: boolean;
  i18n?: string;
  foreignDao: Record<string, string>;
  permissionsCreateFrg?: boolean;
  onCreateFrg?: (value: string) => void;
  readOnly?: boolean;
  nameBtnClose?: string;
  nameBtnCreate?: string;
  template?: "outlined" | string;
  iconClr?: string;
  iconSelect?: string;
  crud?: boolean;
  onClicCrud?: (event: MouseEvent) => void;
}

export const CmpFieldSelect: React.FC<CmpFieldSelectProps> = ({
  id,
  label = "",
  value = "",
  maxIntStr,
  i18n,
  mandatory = false,
  disabled = false,
  autoComplete = "off",
  reference,
  onChange = () => { },
  template,
  iconSelect = ICONS_FIELD.LIST_CHECK,
  iconClr = "",
  foreignDao,
  permissionsCreateFrg = false,
  onCreateFrg = () => { },
  readOnly = true,
  nameBtnClose = "Close",
  nameBtnCreate = "Create",

  crud = false,
  onClicCrud = () => { },
}) => {
  const [labelFocus, setLabelFocus] = useState(false);
  const [labFocStyle, setLabFocStyle] = useState(false);
  const [styleError, setStyleError] = useState(false);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    if (value && foreignDao[value]) {
      const nameValue = foreignDao[value];
      onChange(value, nameValue);
    }
  }, []);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: globalThis.MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        if (showList) {
          setShowList(false);
          setLabelFocus(value !== "");
          setLabFocStyle(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showList, value]);

  const handleFocusEvent = (event: MouseEvent | FocusEvent) => {
    const typeEvent = event.type;

    if ([undefined, "click"].includes(typeEvent)) {
      if (!showList) {
        setLabelFocus(true);
        setLabFocStyle(true);
      } else {
        setLabelFocus(value !== "");
        setLabFocStyle(false);
      }
      setShowList(!showList);
    }
  };

  const onClickItemForeign = (event: MouseEvent<HTMLButtonElement>) => {
    const element = event.currentTarget;
    const elementValue = element.getAttribute("value") || "";
    const elementContext = element.textContent || "";

    onChange(elementValue, elementContext);
    setLabelFocus(true);
    setLabFocStyle(false);
    setShowList(false);
  };

  useEffect(() => {
    if (value === "" && mandatory) {
      setStyleError(true);
    } else if (value !== "" && mandatory) {
      setStyleError(false);
    }

    if (value !== "") {
      setLabelFocus(true);
    }
  }, [value, mandatory]);

  const cleanInput = () => {
    onChange("", "");
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <div className="divFieldInput">
        <CmpFieldLabel
          labelFocus={labelFocus}
          id={id}
          label={label}
          template={template}
        />
        <div
          className={`cmpInputBase-root cmpInput-root cmpInputBase-fullWidth cmpInput-formCtrl cmpInput-underline ${labFocStyle
            ? "cmpInput-underline-focusAF"
            : "cmpInput-underline-focusOFF"
            } ${styleError ? "cmpInput-underline-focus-error" : ""}`}
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
            ref={reference}
            type="text"
            value={value}
            placeholder={label}
            disabled={disabled}
            autoComplete={autoComplete}
            aria-invalid={styleError}
            maxLength={maxIntStr}
            readOnly={readOnly}
            required={mandatory}
            min="0"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onChange(e.target.value)
            }
            onBlur={handleFocusEvent}
            onClick={handleFocusEvent}
          />
          <div className="cmpInput-adorment-root cmpInput-adorment-positionStart">
            <CmpSvg
              onClick={handleFocusEvent}
              icon={iconSelect}
              fontSize={ICONS_SIZE.MEDIUM}
              color={
                styleError
                  ? "var(--clr-error)"
                  : iconClr || "var(--clr-default)"
              }
              style={{ marginInlineEnd: "-5pt" }}
              cursor="pointer"
            />
            {value && (
              <CmpSvg
                onClick={cleanInput}
                icon={ICONS_FIELD.CANCEL}
                fontSize={ICONS_SIZE.SMALL}
                color={"var(--clr-default)"}
                cursor="pointer"
                style={{ position: "absolute", right: "24px" }}
              />
            )}
          </div>
        </div>
      </div>
      {showList && (
        <ComponentSelect
          dataElements={foreignDao}
          i18n={i18n}
          valFgn={value}
          onClicDtaFgn={onClickItemForeign}
          onCreateFrg={onCreateFrg}
          permissionsCreateFrg={permissionsCreateFrg}
          nameBtnClose={nameBtnClose}
          nameBtnCreate={nameBtnCreate}
          onCloseList={handleFocusEvent}
          crud={crud}
          onClicCrud={onClicCrud}
        />
      )}
    </div>
  );
};

interface ComponentSelectFrgProps {
  dataElements: Record<string, string>;
  i18n?: string;
  valFgn?: string;
  onClicDtaFgn: (event: MouseEvent<HTMLButtonElement>) => void;
  onCloseList: (event: MouseEvent | FocusEvent) => void;
  onCreateFrg: (value: string) => void;
  permissionsCreateFrg?: boolean;
  nameBtnClose?: string;
  nameBtnCreate?: string;
  crud?: boolean;
  onClicCrud?: (event: MouseEvent) => void;
}

const ComponentSelect: React.FC<ComponentSelectFrgProps> = ({
  dataElements,
  i18n,
  valFgn = "",
  onClicDtaFgn,
  onCloseList,
  onCreateFrg,
  permissionsCreateFrg = false,
  nameBtnClose = "Close",
  nameBtnCreate = "Create",
  crud = true,
  onClicCrud = () => { },
}) => {
  const [valFilter, setValFilter] = useState("");
  const [btnCreate, setBtnCreate] = useState(false);

  const onChangeFilter = (value: string) => {
    const arrDtElements = Object.values(dataElements);
    const valFilter = value.toLowerCase();

    const validateFilter = arrDtElements.some((item) =>
      item.toLowerCase().includes(valFilter)
    );

    setBtnCreate(!validateFilter && permissionsCreateFrg);
    setValFilter(value);
  };

  return (
    <div className="cmpFieldSelect">
      <div style={{ display: "flex", width: "100%", position: "relative" }}>
        <input
          className="cmpCntrlSearch"
          type="text"
          placeholder="Buscar"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChangeFilter(e.target.value)
          }
        />
        <CmpSvg
          icon={ICONS_FIELD.SEARCH}
          fontSize={ICONS_SIZE.MEDIUM}
          color={"var(--clr-default)"}
          style={{ position: "absolute", top: "0.3rem", right: "0.35rem" }}
        />
      </div>

      <div className="cmpSelectBody">
        <div className="cmpSelectList">
          {Object.entries(dataElements).map(([key, value]) => {
            const isActive = valFgn === value;
            const isVisible = value
              .toLowerCase()
              .includes(valFilter.toLowerCase());

            return (
              isVisible && (
                <div
                  key={key}
                  style={
                    crud
                      ? {
                        display: "grid",
                        gridTemplateColumns: "auto 80px",
                        gridAutoFlow: "column",
                        alignItems: "center",
                        gap: "5px",
                      }
                      : {}
                  }
                >
                  <button
                    type="button"
                    value={key}
                    className={`cmpSelectList-items cmpSelectList-items-action ${isActive ? "cmpSelectCheck" : ""
                      }`}
                    onClick={onClicDtaFgn}
                  >
                    {value}
                  </button>
                  {crud && (
                    <div style={{ margin: "0pt 0pt 3pt" }}>
                      <CmpSvg
                        icon={ICONS_FIELD.EDIT}
                        fontSize={ICONS_SIZE.SMALL}
                        cursor="pointer"
                        color={"var(--clr-ico-back)"}
                        style={{
                          marginInlineEnd: "5px",
                          padding: "6px",
                          borderRadius: "5px",
                          backgroundColor: "var(--primary-color)",
                        }}
                        onClick={onClicCrud}
                      />
                      <CmpSvg
                        icon={ICONS_FIELD.DELETE}
                        fontSize={ICONS_SIZE.SMALL}
                        cursor="pointer"
                        color="var(--primary-color)"
                        style={{
                          marginInlineEnd: "5px",
                          padding: "5px",
                          borderRadius: "5px",
                          border: "1px solid var(--primary-color)",
                          backgroundColor: "#fff",
                        }}
                        onClick={onClicCrud}
                      />
                    </div>
                  )}
                </div>
              )
            );
          })}
        </div>
      </div>
      <div className="cmpFieldSltBtn">
        <CmpButton
          onClick={onCloseList}
          variant="outlined"
          nameBtn={nameBtnClose}
          style={{ padding: "1pt 12pt" }}
        />
        {btnCreate && (
          <CmpButton
            onClick={() => onCreateFrg(valFilter)}
            variant="contained"
            nameBtn={nameBtnCreate}
            style={{ padding: "1pt 12pt" }}
          />
        )}
      </div>
    </div>
  );
};
