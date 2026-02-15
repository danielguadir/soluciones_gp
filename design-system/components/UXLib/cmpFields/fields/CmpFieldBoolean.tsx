import React from "react";
import { CmpFieldCheckbox } from "./CmpFieldCheckbox";

interface CmpFieldBooleanProps {
  id?: string | number;
  label?: string;
  value?: boolean;
  reference?: React.RefObject<HTMLInputElement>;
  template?: "outlined" | string;
  variant?: "switch" | "squared";
  onChange: (checked: boolean) => void;
}

export const CmpFieldBoolean: React.FC<CmpFieldBooleanProps> = ({
  id = "cmpFieldBoolean",
  value = false,
  label = "",
  reference,
  onChange = () => {},
  template,
  variant = "switch",
}) => {
  return (
    <div
      className="cmp-Boolean cmpInputBase-input"
      style={template === "outlined" ? { padding: "7px 37px 7px 10px" } : {}}
    >
      <label className="cmpFieldLabel-root" htmlFor={id?.toString()}>
        {label}
      </label>
      <CmpFieldCheckbox
        id={id}
        checked={value}
        inputRef={reference}
        onChange={onChange}
        variant={variant}
      />
    </div>
  );
};
