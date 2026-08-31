import React from "react";

export interface CreativeSeparatorProps {
  className?: string;
  bgColor?: string;
}

export const CreativeSeparator: React.FC<CreativeSeparatorProps> = ({
  className = "",
  bgColor = "bg-[#0f172a]",
}) => {
  return (
    <div className={`relative flex items-center justify-center my-16 sm:my-20 ${className}`}>
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"></div>
      <div className={`absolute px-6 ${bgColor} flex items-center gap-2`}>
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_#3b82f6]"></span>
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 opacity-80"></span>
        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse delay-300 shadow-[0_0_10px_#6366f1]"></span>
      </div>
    </div>
  );
};
