import React from "react";
import { User } from "lucide-react";

export interface UserButtonProps {
  onClick?: () => void;
  className?: string;
  avatarUrl?: string | null;
  name?: string;
  title?: string;
  ariaLabel?: string;
}

export const UserButton: React.FC<UserButtonProps> = ({
  onClick,
  className = "",
  avatarUrl,
  name,
  title = "Ingresar / Iniciar sesión",
  ariaLabel = "Ingresar / Iniciar sesión",
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-1.5 text-gray-200 hover:text-white transition-colors duration-300 cursor-pointer focus:outline-none flex items-center justify-center shrink-0 ${className}`}
      title={title}
      aria-label={ariaLabel}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name || "Usuario"}
          className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover border border-white/20"
        />
      ) : (
        <User size={22} className="w-5 h-5 sm:w-6 sm:h-6 transition-colors" />
      )}
    </button>
  );
};

export default UserButton;
