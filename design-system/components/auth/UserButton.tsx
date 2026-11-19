import React from "react";
import { User } from "lucide-react";
import { DEFAULT_AVATAR_URL } from "@/lib/utils/constants";

export interface UserButtonProps {
  onClick?: () => void;
  className?: string;
  avatarUrl?: string | null;
  name?: string;
  title?: string;
  ariaLabel?: string;
  iconClassName?: string;
}

export const UserButton: React.FC<UserButtonProps> = ({
  onClick,
  className = "",
  avatarUrl,
  name,
  title = "Ingresar / Iniciar sesión",
  ariaLabel = "Ingresar / Iniciar sesión",
  iconClassName = "w-5 h-5 sm:w-6 sm:h-6 transition-colors",
}) => {
  // Only display an image if it is an actual custom profile picture (not the default placeholder)
  const isCustomAvatar = Boolean(
    avatarUrl &&
      avatarUrl !== DEFAULT_AVATAR_URL &&
      !avatarUrl.includes("default-avatar")
  );

  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-1.5 text-gray-200 hover:text-white transition-colors duration-300 cursor-pointer focus:outline-none flex items-center justify-center shrink-0 ${className}`}
      title={title}
      aria-label={ariaLabel}
    >
      {isCustomAvatar ? (
        <img
          src={avatarUrl!}
          alt={name || "Perfil de usuario"}
          className="w-full h-full rounded-full object-cover border border-white/20"
        />
      ) : (
        <User size={22} className={iconClassName} />
      )}
    </button>
  );
};

export default UserButton;
