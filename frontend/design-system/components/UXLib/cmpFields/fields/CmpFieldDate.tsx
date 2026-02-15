"use client";
import React, {
  useState,
  useEffect,
  MouseEvent,
  FocusEvent,
  ChangeEvent,
} from "react";
import { CmpFieldLabel } from "./CmpFieldLabel";
import { Svg as CmpSvg } from "../../Svg/Svg";
import { Button as CmpButton } from "../../Button/Button";
import { ICONS_FIELD, ICONS_SIZE, longToDate, dateToLong } from "../utils";
import { DaysPicker } from "./utilsDate/DaysPicker";
import { format } from "date-fns";

interface CmpFieldSelectProps {
  id?: string;
  label?: string;
  value?: string | number | Date | null;
  reference?: React.RefObject<HTMLInputElement>;
  mandatory?: boolean;
  disabled?: boolean;
  template?: "outlined" | string;
  bckCalendar?: string;
  modeSelectDate?: "single" | "range";
  minDate?: object;
  maxDate?: object;
  numOfMonth?: number;
  formatDate: string;
  onChange: (value: string | null | number, name?: string | object) => void;
  readOnly?: boolean;
  nameBtnClose?: string;
  iconClr?: string;
  iconSelect?: string;
}

export const CmpFieldDate: React.FC<CmpFieldSelectProps> = ({
  id = "date",
  label = "",
  onChange = () => { },
  value = "",
  reference,
  disabled = false,
  mandatory = false,
  readOnly = false,
  nameBtnClose = "Close",
  template,
  iconClr = "",
  iconSelect = "",
  modeSelectDate,
  bckCalendar = "var(--clr-ico-back)",
  // setDateCalendar,
  numOfMonth,
  minDate,
  maxDate,
  formatDate = "yyyy-MM-dd",
}) => {
  const [labelFocus, setLabelFocus] = useState(false);
  const [labFocStyle, setLabFocStyle] = useState(false);
  const [styleError, setStyleError] = useState(false);
  const [showList, setShowList] = useState(false);
  const [dateValue, setvalue] = useState<any>(value);

  const handleFocusEvent = (event: MouseEvent | FocusEvent) => {
    const typeEvent = event.type;

    if ([undefined, "click"].includes(typeEvent)) {
      if (!showList) {
        setLabelFocus(true);
        setLabFocStyle(true);
      } else {
        setLabelFocus(dateValue !== "");
        setLabFocStyle(false);
      }
      setShowList(!showList);
    }
  };

  useEffect(() => {
    if (dateValue === "" && mandatory) {
      setStyleError(true);
    } else if (dateValue !== "" && mandatory) {
      setStyleError(false);
    }

    if (dateValue !== "") {
      setLabelFocus(true);
    }
  }, [dateValue, mandatory]);

  const cleanInput = () => {
    onChange("", "");
    setvalue("");
  };

  const fieldDate = (longDate) => {
    let resultLong;
    let resultDate;

    if (typeof longDate === "number") {
      resultLong = longDate;
      resultDate = longToDate(longDate);
    } else {
      resultLong = dateToLong(longDate);
      resultDate = longDate;
    }

    //  const formDate = format(resultDate, "dd/MMMM/yyyy")
    setvalue(resultDate);
    onChange(resultLong);
  };

  return (
    <>
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
            value={dateValue !== "" ? format(dateValue, formatDate) : dateValue}
            placeholder={label}
            disabled={disabled}
            aria-invalid={styleError}
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
              icon={iconSelect || ICONS_FIELD.DATE_ICON}
              fontSize={ICONS_SIZE.MEDIUM}
              color={
                styleError
                  ? "var(--clr-error)"
                  : iconClr || "var(--clr-default)"
              }
              style={{ marginInlineEnd: "-5pt" }}
              cursor="pointer"
            />
            {dateValue && (
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
          nameBtnClose={nameBtnClose}
          onCloseList={handleFocusEvent}
          fieldDate={fieldDate}
          modeSelectDate={modeSelectDate}
          bckCalendar={bckCalendar}
          setDateCalendar={dateValue}
          numOfMonth={numOfMonth}
          minDate={minDate}
          maxDate={maxDate}
        />
      )}
    </>
  );
};

interface ComponentSelectFrgProps {
  onCloseList: (event: MouseEvent | FocusEvent) => void;
  nameBtnClose?: string;
  modeSelectDate?: "single" | "range";
  fieldDate: (value: Date) => void;
  bckCalendar?: string;
  setDateCalendar?: Date | number;
  numOfMonth?: number;
  minDate?: object;
  maxDate?: object;
  formatDate?: string;
}

const ComponentSelect: React.FC<ComponentSelectFrgProps> = ({
  onCloseList,
  nameBtnClose = "Close",
  fieldDate,
  setDateCalendar,
  modeSelectDate,
  bckCalendar,
  numOfMonth,
  minDate,
  maxDate,
}) => {
  const handleCloseList = (e: MouseEvent | FocusEvent) => {
    onCloseList(e);
  };

  return (
    <div className="cmpFieldSelectDate" style={{ background: bckCalendar }}>
      <div className="cmpTitleIcon">{"Seleccione una fecha"}</div>

      <div className="cmpSelectBodyDate">
        <div className="cmpSelectList">
          {
            <DaysPicker
              modeSelectDate={modeSelectDate}
              setDateCalendar={setDateCalendar}
              numOfMonth={numOfMonth}
              //   defaultMonth={new Date(2024, 6)}
              startMonth={minDate}
              endMonth={maxDate}
              pickerDate={fieldDate}
            />
          }
        </div>
      </div>
      <div className="cmpFieldSltBtn">
        <CmpButton
          onClick={(e: any) => handleCloseList(e)}
          variant="outlined"
          nameBtn={nameBtnClose}
          style={{ padding: "1pt 12pt" }}
        />
      </div>
    </div>
  );
};
