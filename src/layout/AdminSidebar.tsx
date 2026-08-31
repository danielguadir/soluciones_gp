"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, Svg } from "@/components";
import { DEFAULT_AVATAR_URL } from "@/lib/utils/constants";

interface AdminSidebarProps {
    onLogout?: () => void;
}

interface AdminUser {
    id?: string;
    email?: string;
    name?: string | null;
    avatarUrl?: string | null;
}

const AdminSidebar = ({ onLogout }: AdminSidebarProps) => {
    const pathname = usePathname();
    const [user, setUser] = useState<AdminUser | null>(null);

    useEffect(() => {
        const savedUser = localStorage.getItem("admin_user");
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch {
                // Safe parsing fallback
            }
        }
    }, []);

    const menuItems = [
        { name: "Dashboard", href: "/admin", icon: "dashboard" },
        { name: "Servicios", href: "/admin/servicios", icon: "briefcase" },
        { name: "Mensajes", href: "/admin/mensajes", icon: "mail" },
        { name: "Configuración", href: "/admin/config", icon: "cog" },
    ];

    return (
        <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col sticky top-0 border-r border-gray-800">
            <div className="p-6 border-b border-gray-800">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-12 h-12 group-hover:scale-110 transition-transform">
                        <img src="/images/icono_tec.png" alt="GP" className="w-full h-full object-contain" />
                    </div>
                    <span className="text-lg font-bold tracking-tight">Admin GP</span>
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-1 mt-4">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
                                : "text-gray-400 hover:text-white hover:bg-gray-800"
                                }`}
                        >
                            <Svg
                                icon={item.icon}
                                fontSize="20px"
                                color={isActive ? "#fff" : "currentColor"}
                            />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-800 space-y-3">
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/60 border border-white/5">
                    <Avatar
                        src={user?.avatarUrl || DEFAULT_AVATAR_URL}
                        name={user?.name || user?.email || "Admin"}
                        size={36}
                        className="border border-blue-500/30 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate">
                            {user?.name || "Administrador"}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                            {user?.email || "admin@impulsogp.com"}
                        </p>
                    </div>
                </div>

                <button 
                    onClick={onLogout}
                    className="flex items-center gap-3 px-4 py-2.5 w-full rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors text-sm font-medium"
                >
                    <Svg icon="logout" fontSize="18px" color="currentColor" />
                    <span>Cerrar Sesión</span>
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
