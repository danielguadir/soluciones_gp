import React, { useState, useEffect, ChangeEvent } from "react";
import { Svg as CmpSvg } from "../../Svg/Svg";
import { ICONS_FIELD, ICONS_SIZE } from "../utils";

type CheckboxVariant = "switch" | "squared";

interface CheckboxProps {
  id?: string | number;
  checked?: boolean;
  onChange: (isChecked: boolean) => void;
  variant?: CheckboxVariant;
  inputRef?: React.RefObject<HTMLInputElement>;
  className?: string;
  style?: React.CSSProperties;
  iconCheck?: string;
  icondefault?: string;
  iconClr?: string;
  disabled?: boolean;
}

export const CmpFieldCheckbox: React.FC<CheckboxProps> = ({
  id,
  checked = false,
  onChange = () => { },
  variant = "squared",
  inputRef,
  className = "",
  style = {},
  iconCheck = ICONS_FIELD.CHECK,
  icondefault = ICONS_FIELD.ADD,
  iconClr = "var(--clr-ico-back)",
  disabled = false,
}) => {
  const [isChecked, setIsChecked] = useState(checked);

  // Sincroniza el estado interno cuando cambia la prop checked
  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newCheckedState = event.currentTarget.checked;
    setIsChecked(newCheckedState);
    onChange(newCheckedState);

  };



  return (
    <div>
      <input
        ref={inputRef}
        type="checkbox"
        id={id?.toString()}
        checked={isChecked}
        onChange={handleChange}
        className="cmp-checkbox"
        aria-checked={isChecked}
        required={disabled ? false : undefined} // Or just leave it to the browser
      />
      <label
        className={`cmp-chxBox-${variant} ${className}`}
        htmlFor={id?.toString()}
        style={style}
      >
        {variant === "squared" && (
          <CmpSvg
            icon={isChecked ? iconCheck : icondefault}
            fontSize={ICONS_SIZE.SMALL}
            color={iconClr}
          />
        )}
      </label>
    </div>
  );
};