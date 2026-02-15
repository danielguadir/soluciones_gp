import React, { useState } from "react";
import { Button } from "./Button";
//import "./CmpButtonSwt.css";

interface ButtonSwtProps {
  btns?: string[];
  onCallBack: (data: { name: string; position: number }) => void;
  btnInit?: number;
  btnClrGroup?: string;
  //  style?: React.CSSProperties;
}


export const ButtonSwt: React.FC<ButtonSwtProps> = ({
  btns = ["UNO", "DOS", "TRES", "CUATRO", "CINCO"],
  onCallBack,
  btnInit = 2,
  btnClrGroup,
  //  style = {},

}) => {
  const [btnOn, setbtnOn] = useState<number>(btnInit);
  const btnEnd = btns.length - 1;

  const onClickBtn = (name: string, position: number) => {
    setbtnOn(position);
    onCallBack({ name, position });
  };

  return (
    <div className="btnSwc-container">
      {btns.map((btn, index) => (
        <Button
          key={index}
          className={
            index === 0
              ? "btn-init btn-item"
              : index === btnEnd
                ? "btn-item btn-end"
                : index === btnOn ? "btn-item btn-selected"
                  : "btn-item"
          }
          variant={index === btnOn ? "contained" : "outlined"}
          onClick={() => onClickBtn(btn, index)}
          nameBtn={btn}
          color={btnClrGroup}
        />
      ))}
    </div>
  );
};