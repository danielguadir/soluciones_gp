"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Svg } from "@/components";

const AdminSidebar = () => {
    const pathname = usePathname();

    const menuItems = [
        { name: "Dashboard", href: "/admin", icon: "dashboard" },
        { name: "Servicios", href: "/admin/servicios", icon: "briefcase" },
        { name: "Mensajes", href: "/admin/mensajes", icon: "mail" },
        { name: "Configuración", href: "/admin/config", icon: "cog" },
    ];

    return (
        <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col sticky top-0">
            <div className="p-6 border-b border-gray-800">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-[118px] h-[118px] group-hover:scale-110 transition-transform drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]">
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

            <div className="p-4 border-t border-gray-800">
                <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors">
                    <Svg icon="logout" fontSize="20px" color="currentColor" />
                    <span className="font-medium">Cerrar Sesión</span>
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
