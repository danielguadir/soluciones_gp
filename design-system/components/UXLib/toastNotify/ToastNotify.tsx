"use client";
import React, { useEffect, useState } from "react";
import { CmpSvg } from "../cmpSvg/CmpSvg";

type NotifyType = "success" | "info" | "warning" | "error";
type NotifyConfigKey = Uppercase<NotifyType>;

interface ToastNotifyProps {
  type?: NotifyType;
  message?: string;
  durationTime?: number;
}

const config: Record<NotifyConfigKey, { icon: string; bckGrd: string; bckGrdShd: string }> = {
  SUCCESS: { icon: "ok", bckGrd: "success", bckGrdShd: "#1B5E20" },
  INFO: { icon: "info-circled", bckGrd: "info", bckGrdShd: "#17a2b8" },
  WARNING: { icon: "attention", bckGrd: "warning", bckGrdShd: "#ffc107" },
  ERROR: { icon: "exclamation", bckGrd: "error", bckGrdShd: "#b81111" },
};

export const ToastNotify: React.FC<ToastNotifyProps> = ({
  type = "success",
  message = "Zhad is the best",
  durationTime = 5,
}) => {
  const [addClassToast, setaddClassToast] = useState(false);
  const [addClassProgress, setaddClassProgress] = useState(false);

  const notify = (() => {
    const titleCapital = type.charAt(0).toUpperCase() + type.slice(1);
    return { ...config[type.toUpperCase() as NotifyConfigKey], title: titleCapital };
  })();

  useEffect(() => {
    setaddClassToast(true);
    setaddClassProgress(true);
  }, []);

  useEffect(() => {
    const seg = durationTime * 1000;
    const timer = window.setTimeout(() => {
      setaddClassProgress(false);
      setaddClassToast(false);
    }, seg);

    return () => window.clearTimeout(timer);
  }, [addClassToast, durationTime]);

  return (
    <div className={`toast ${addClassToast ? "active" : ""} toast-${notify.bckGrd}`}>
      <div className="toast-content">
        <div className="check">
          <CmpSvg icon={notify.icon} fontSize="21pt" color="#fff" />
        </div>
        <div className="message">
          <span className="text text-1">{notify.title}</span>
          <span className="text text-2">{message}</span>
        </div>
        <div
          className="close"
          onClick={() => {
            setaddClassToast(false);
            window.setTimeout(() => {
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
          "--zNtfy-clrShd": notify.bckGrdShd,
          "--zNtfy-timer": `${durationTime}s`,
        } as React.CSSProperties}
      ></div>
    </div>
  );
};
