import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
//import "../theme/componentStyles.scss";
import { CmpSvg } from "../cmpSvg/CmpSvg";

const TYPE = {
  SUCCESS: "success", // ok
  INFO: "info", // info, info-circled, attention-circled, info-1
  WARNING: "warning", // attention-2, attention
  ERROR: "error", // attention-alt, exclamation
};
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

export const ToastNotify = ({
  type = "Success",
  message = "Zhad is the best",
  durationTime = 5,
}) => {
  const [addClassToast, setaddClassToast] = useState(false);
  const [addClassProgress, setaddClassProgress] = useState(false);

  const typeNotify = () => {
    type = type.toLowerCase();
    const typeNotfy = TYPE.SUCCESS.includes(type)
      ? "SUCCESS"
      : TYPE.INFO.includes(type)
      ? "INFO"
      : TYPE.WARNING.includes(type)
      ? "WARNING"
      : "ERROR";

    const titleCapital = (type) => type.charAt(0).toUpperCase() + type.slice(1);

    const notify = { ...config[typeNotfy], title: titleCapital };

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
      className={`toast ${addClassToast ? "active" : ""} toast-${
        typeNotify().notify.bckGrd
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
        }}
      ></div>
    </div>
  );
};

ToastNotify.propTypes = {
  tipe: PropTypes.string,
  message: PropTypes.string,
  durationTime: PropTypes.number,
};
