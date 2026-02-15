"use client";
import React, { useEffect, useState } from "react";
//import "../theme/componentStyles.scss";
import { CmpSvg } from "../cmpSvg/CmpSvg";

// ... previous interfaces and types ...

// (I will skip repeating the interfaces since I'm using replace_file_content chunk)

type PropTypes = "success" | "info" | "warning" | "error";

interface ToastNotifyProps {
  type: PropTypes;
  message?: string;
  durationTime?: number;
}

// map.get($theme-clrs-notify,
const config = {
  SUCCESS: { icon: "ok", bckGrd: "success", bckGrdShd: "#1B5E20" },
  INFO: { icon: "info-circled", bckGrd: "info", bckGrdShd: "#17a2b8" },
  WARNING: { icon: "attention", bckGrd: "warning", bckGrdShd: "#ffc107" },
  ERROR: { icon: "exclamation", bckGrd: "error", bckGrdShd: "#b81111" },
};

/**
 * @name ToastNotify
 * @type {string } tipo de nofificacion success || info || warning || error
 * @message {string } mensaje de la notificacion
 * @durationTime {number || null } duracion de la notificacion en segundos
 * @color {string || null} sera un nuevo feature
 * @return {}
 */

export const ToastNotify: React.FC<ToastNotifyProps> = ({
  type = "Success",
  message = "Zhad is the best",
  durationTime = 5,
}) => {
  const [addClassToast, setaddClassToast] = useState(false);
  const [addClassProgress, setaddClassProgress] = useState(false);

  const typeNotify = () => {
    const titleCapital = type.charAt(0).toUpperCase() + type.slice(1);

    const notify = { ...config[type.toUpperCase()], title: titleCapital };
    return { notify };
  };

  useEffect(() => {
    setaddClassToast(true);
    setaddClassProgress(true);
  }, []);

  useEffect(() => {
    const seg = durationTime * 1000;
    setTimeout(() => {
      setaddClassProgress(false);
      setaddClassToast(false);
    }, seg);
  }, [addClassToast]);

  return (
    <div
      className={`toast ${addClassToast ? "active" : ""} toast-${typeNotify().notify.bckGrd
        }`}
    >
      <div className="toast-content">
        <div className="check">
          <CmpSvg
            icon={typeNotify().notify.icon}
            fontSize="21pt"
            color="#fff"
          />
        </div>
        <div className="message">
          <span className="text text-1">{typeNotify().notify.title}</span>
          <span className="text text-2">{message}</span>
        </div>
        <div
          className="close"
          onClick={() => {
            setaddClassToast(false);

            setTimeout(() => {
              setaddClassProgress(false);
            }, durationTime);
          }}
        >
          <CmpSvg icon="cancel" fontSize="15pt" color="#fff" />
        </div>
      </div>
      <div
        className={`progress ${addClassProgress ? "active" : ""}`}
        style={{
          "--zNtfy-clrShd": typeNotify().notify.bckGrdShd,
          "--zNtfy-timer": `${durationTime}s`,
        } as any}
      ></div>
    </div>
  );
};
