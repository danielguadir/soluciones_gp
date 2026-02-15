import React, { useState, useEffect, useRef } from "react";
import { Button as CmpButton } from "../../Button/Button";
import { CmpFieldCheckbox } from "./CmpFieldCheckbox";
import { CmpFieldLabel } from "./CmpFieldLabel";
import { Svg as CmpSvg } from "../../Svg/Svg";
import { ICONS_FIELD, ICONS_SIZE } from "../utils";

interface ForeignData {
  [key: string]: [string, boolean];
}

interface FieldForeignMultiProps {
  id?: string;
  label?: string;
  value: string[];
  maxIntStr?: number;
  i18n?: string;
  mandatory?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  reference?: React.RefObject<HTMLInputElement>;
  template?: "default" | "outlined" | "standard";
  iconSelect?: string;
  iconClr?: string;
  foreignDao: Record<string, string>;
  permissionsCreateFrg?: boolean;
  onCreateFrg?: (value: string) => void;
  readOnly?: boolean;
  nameBtnClose?: string;
  nameBtnCreate?: string;
  variant?: "switch" | "squared";
  onChange: (keys: string[], values: string[]) => void;
}

export const CmpFieldTab: React.FC<FieldForeignMultiProps> = ({
  id,
  label = "",
  onChange,
  value = [],
  reference,
  disabled = false,
  autoComplete = "off",
  maxIntStr,
  mandatory = false,
  i18n,
  foreignDao,
  permissionsCreateFrg = false,
  readOnly = false,
  nameBtnClose = "Close",
  nameBtnCreate = "Create",
  iconSelect = ICONS_FIELD.LIST_CHECK,
  iconClr = "",
  template = "standard",
  variant = "switch",
}) => {
  const [labelFocus, setLabelFocus] = useState(false);
  const [labFocStyle, setLabFocStyle] = useState(false);
  const [styleError, setStyleError] = useState(false);
  const [showList, setShowList] = useState(false);
  const [dataSelect, setDataSelect] = useState<ForeignData>({});
  const [valueKey, setValueKey] = useState<string[]>(value);
  const [valueLabel, setValueLabel] = useState<string>("");

  useEffect(() => {
    const base: ForeignData = {};
    const values: string[] = [];

    Object.entries(foreignDao).forEach(([key, label]) => {
      const isSelected = valueKey.includes(String(key));
      if (isSelected) {
        values.push(label);
      }
      base[key] = [label, isSelected];
    });

    setDataSelect(base);
    setValueLabel(values.join(", "));
  }, [foreignDao, valueKey]);

  const toggleList = (e: React.MouseEvent | React.FocusEvent) => {
    if (e.type === "click") {
      if (value.length === 0) {
        setLabelFocus(!showList);
      }
      setLabFocStyle(!showList);
      setShowList(!showList);
    }
  };

  const handleItemClick = (valuekey: string) => {
    const newDataSelect = { ...dataSelect };
    newDataSelect[valuekey] = [
      newDataSelect[valuekey][0],
      !newDataSelect[valuekey][1],
    ];
    setDataSelect(newDataSelect);

    const selectedKeys: string[] = [];
    const selectedValues: string[] = [];

    Object.entries(newDataSelect).forEach(([k, [label, isSelected]]) => {
      if (isSelected) {
        selectedKeys.push(String(k));
        selectedValues.push(label);
      }
    });

    setValueKey(selectedKeys);
    setValueLabel(selectedValues.join(", "));
    onChange(selectedKeys, selectedValues);
  };

  const handleCreate = (value: string) => {
    onChange([], [value]);
  };

  useEffect(() => {
    setStyleError(mandatory && value.length === 0);
    if (value.length > 0) {
      setLabelFocus(true);
    }
  }, [value, mandatory]);

  return (
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
        onClick={toggleList}
      >
        <input
          className="cmpInputBase-input cmpInput-input"
          style={
            template === "outlined" ? { padding: "7px 37px 7px 10px" } : {}
          }
          id={id}
          ref={reference}
          type="text"
          value={valueLabel}
          placeholder={label}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-invalid={styleError}
          maxLength={maxIntStr}
          readOnly
        />
        <div className="cmpInput-adorment-root cmpInput-adorment-positionStart">
          <CmpSvg
            icon={iconSelect}
            fontSize={ICONS_SIZE.MEDIUM}
            color={
              styleError ? "var(--clr-error)" : iconClr || "var(--clr-default)"
            }
            style={{ marginInlineEnd: "-5pt" }}
          />
        </div>
      </div>
      {showList && (
        <ComponentSelectFrg
          dataElements={dataSelect}
          i18n={i18n}
          valFgn={valueKey}
          onClicItemSlct={handleItemClick}
          onCreateFrg={handleCreate}
          permissionsCreateFrg={permissionsCreateFrg}
          nameBtnClose={nameBtnClose}
          nameBtnCreate={nameBtnCreate}
          onCloseList={() => setShowList(false)}
          variant={variant}
        />
      )}
    </div>
  );
};

interface ComponentSelectFrgProps {
  dataElements: ForeignData;
  i18n?: string;
  valFgn: string[];
  onClicItemSlct: (key: string) => void;
  onCloseList: () => void;
  onCreateFrg: (value: string) => void;
  permissionsCreateFrg?: boolean;
  nameBtnClose?: string;
  nameBtnCreate?: string;
  variant?: "switch" | "squared";
}
const ComponentSelectFrg: React.FC<ComponentSelectFrgProps> = ({
  dataElements,
  i18n,
  valFgn,
  onClicItemSlct,
  onCloseList,
  onCreateFrg,
  permissionsCreateFrg = false,
  nameBtnClose = "Close",
  nameBtnCreate = "Create",
  variant,
}) => {
  const [valFilter, setValFilter] = useState("");
  const [btnCreate, setBtnCreate] = useState(false);

  const handleFilterChange = (value: string) => {
    const hasMatches = Object.values(dataElements).some(([label]) =>
      label.toLowerCase().includes(value.toLowerCase())
    );
    setBtnCreate(!hasMatches && permissionsCreateFrg);
    setValFilter(value);
  };

  return (
    <div className="cmpFieldSelectTab">
      <div className="cmpTitleIcon">{"Seleccione un registro"}</div>
      <div style={{ display: "flex", width: "100%", position: "relative" }}>
        <input
          className="fieldTab-frmCtrl-search"
          type="text"
          placeholder="Buscar"
          onChange={(e) => handleFilterChange(e.target.value)}
          value={valFilter}
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
          {Object.entries(dataElements).map(([key, [label, isSelected]]) => {
            if (!label.toLowerCase().includes(valFilter.toLowerCase())) {
              return null;
            }

            return (
              <div
                key={key}
                className={`fieldSelect-itemChk itemChk-${variant}`}
              >
                <CmpFieldCheckbox
                  id={`checkBox_${key}`}
                  checked={isSelected}
                  onChange={() => onClicItemSlct(key)}
                  variant={variant}
                  iconCheck="ok"
                  icondefault="plus"
                />
                <button
                  type="button"
                  className={`cmpSelectList-items cmpSelectList-items-action ${valFgn.includes(String(key)) ? "cmpSelectCheck" : ""
                    }`}
                  onClick={() => onClicItemSlct(key)}
                >
                  {label}
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <div className="cmpFieldSltBtn">
        <CmpButton
          onClick={onCloseList}
          variant="outlined"
          nameBtn={nameBtnClose}
          style={{ padding: "1pt 12pt", fontSize: "1.2rem" }}
        />
        {btnCreate && (
          <CmpButton
            onClick={() => onCreateFrg(valFilter)}
            variant="contained"
            nameBtn={nameBtnCreate}
            style={{ padding: "1pt 12pt", fontSize: "1.2rem" }}
          />
        )}
      </div>
    </div>
  );
};
