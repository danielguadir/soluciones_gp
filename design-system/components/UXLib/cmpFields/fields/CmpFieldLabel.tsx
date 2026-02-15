import React from "react";

interface CmpFieldLabelProps {
  labelFocus?: boolean;
  id?: string;
  label?: string;
  template?: "outlined" | string; // More specific if there are other known template values
}

export const CmpFieldLabel: React.FC<CmpFieldLabelProps> = ({
  labelFocus = false,
  id,
  label,
  template,
}) => {
  return (
    <label
      className={`cmpFieldLabel-root cmpInputLabel-root cmpInputLabel-formCtrl cmpInputLabel-animated ${
        labelFocus ? "cmpInputLabel-shrink" : ""
      }`}
      data-shrink={labelFocus}
      htmlFor={id}
      style={template === "outlined" ? { left: "7px" } : {}}
    >
      {label}
    </label>
  );
};
