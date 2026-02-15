import React, { useReducer, useEffect } from "react";
import { CmpFieldProps, FieldState, FieldAction } from "./fields/types";
import { FieldFactory } from "./fields/FieldFactory";
import { validateValue } from "./fields/validators";

const TYPES = { STATE_FIELD: "STATE_FIELD" };

const reducer = (state: FieldState, action: FieldAction): FieldState => {
  switch (action.type) {
    case TYPES.STATE_FIELD: {
      const { value, text, validation } = action.payload.dataValidate;
      return { ...state, value, text, validation };
    }
    default:
      return state;
  }
};

const i18N =
  typeof window !== "undefined" &&
    (window.navigator.language || (window.navigator as any).browserLanguage || "en")
      .split("-")[0] === "es"
    ? "es"
    : "en";

export const CmpField: React.FC<CmpFieldProps> = ({
  id,
  label = "",
  value = "",
  type,
  mandatory = false,
  className = "",
  template = "outlined",
  expReg = "",
  getValue = (
    id: string,
    value: any,
    isValid: boolean,
    textField: string
  ) => { },
  ...rest
}) => {
  const maxIntStr = rest?.maxStr ? parseInt(rest.maxStr.toString()) : Infinity;

  const defaultValue = (): any => {
    let result = value;

    if (
      ["boolean", "Boolean", "BOOLEAN"].includes(type) &&
      ["", null, undefined].includes(value)
    ) {
      result = false;
      value = result;
    }

    if (typeof value === "string" && value.length > maxIntStr) {
      result = value.substring(0, maxIntStr);
    }

    return result;
  };

  const initialState: FieldState = {
    value: defaultValue(),
    text: "",
    validation: { show: false, msn: "" },
    i18n: i18N,
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (["", null].includes(state.value)) {
      validateField(state.value, null);
    } else {
      if (
        ["foreign", "Foreign", "FOREIGN"].includes(type) &&
        rest?.foreignDao
      ) {
        const foreignDao = rest.foreignDao as any;
        const nameValue = foreignDao[state.value];
        if (nameValue !== undefined) {
          onChange(state.value, nameValue);
        }
      } else {
        onChange(state.value, null);
      }
    }
  }, []);

  const onChange = (value: any, textField?: string | null) => {
    const safeTextField: string | null =
      typeof textField === "string" || textField === null ? textField : null;
    if (value === null && safeTextField !== null) {
      rest?.onCreateFrg?.(textField || "");
    } else {
      validateField(value, safeTextField);
    }
  };

  const validateField = (
    value: any = null,
    textField?: string | object | null
  ) => {
    if (type.toLowerCase() === "select" && typeof value === "string") {
      value = value.split(",");
    }

    const { valueVali, error } = validateValue({
      valueVali: value,
      textField,
      type,
      mandatory,
      maxIntStr,
      expReg,
      ...rest,
    });
    const isValid = error === null;

    const dataValidate: { value: any | File; text: any; validation: any } = {
      value: valueVali,
      text: textField || "",
      validation: { show: isValid, msn: error },
    };

    if (type.toLowerCase() !== "typedocument" && typeof value === "object") {
      value = JSON.stringify(value);
    }

    if (type.toLowerCase() === "typedocument") {
      value = valueVali;
    }

    getValue(id || "", value, isValid, textField ? textField.toString() : "");
    dispatch({ type: TYPES.STATE_FIELD, payload: { dataValidate } });
  };

  return (
    <div
      className={
        className
          ? `${className} template-${template}`
          : `container-field template-${template}`
      }
    >
      {type.toLowerCase() !== "hidden" && (
        <FieldFactory
          {...rest}
          id={id}
          label={label}
          value={state.value}
          type={type}
          mandatory={mandatory}
          className={className}
          template={template}
          expReg={expReg}
          onChange={onChange}
          error={state?.validation?.msn}
        />
      )}

      {mandatory && rest?.iconMndtory && (
        <span className="field-valIcon">*</span>
      )}
      {state.validation.msn !== "" && (
        <span className="field-valMsn">{state.validation.msn}</span>
      )}
    </div>
  );
};
