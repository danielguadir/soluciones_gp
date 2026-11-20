"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Svg, UserButton } from "@/components";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();

    const toggleMenu = () => setIsOpen(!isOpen);

    const navLinks = [
        { name: "Inicio", href: "/" },
        { name: "Servicios", href: "/servicios" },
        { name: "Portafolio", href: "/portafolio" },
        { name: "Curiosidades", href: "/curiosidades" },
        { name: "Contacto", href: "/" },
    ];

    const navItemWrapper = "relative group inline-flex rounded-full overflow-hidden transition-all duration-300 ease-out hover:scale-105";
    const navItemBackground = "absolute inset-0 bg-white/0 group-hover:bg-white/10 group-hover:shadow-[0_0_18px_rgba(255,255,255,0.25)] transition-all duration-300";
    const navItemText = "relative text-slate-300 group-hover:text-white font-medium transition-colors duration-300 text-sm uppercase tracking-wider";

    return (
        <nav className="bg-[#0f172a]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="relative w-12 h-12 flex items-center justify-center">
                                <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-lg group-hover:bg-blue-500/40 transition-all duration-500"></div>
                                <div className="relative w-full h-full p-0.5 bg-slate-900/50 rounded-xl backdrop-blur-sm transition-all duration-300">
                                    <img
                                        src="/images/icono_tec.png"
                                        alt="GP"
                                        className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-black text-white tracking-tighter leading-none group-hover:text-blue-400 transition-colors">
                                    IMPULSO<span className="text-blue-500">GP</span>
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Menu & Auth Controls */}
                    <div className="hidden md:flex items-center space-x-2">
                        {navLinks.map((link) => {
                            const isActive =
                                link.href === "/"
                                    ? pathname === "/"
                                    : pathname.startsWith(link.href);
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`relative inline-flex items-center justify-center rounded-full transition-all duration-300 ease-out ${
                                        isActive
                                            ? "px-5 py-1.5 bg-blue-600/25 border border-blue-400/50 text-cyan-300 shadow-[0_0_14px_rgba(59,130,246,0.3)] font-bold text-sm tracking-wider uppercase scale-105"
                                            : "px-3.5 py-1.5 text-slate-300 hover:text-white hover:bg-white/5 font-medium text-sm tracking-wider uppercase transition-colors"
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}

                        <div className="h-5 w-[1px] bg-white/10 mx-2" aria-hidden="true" />

                        {/* User Profile Button & Dropdown */}
                        <div className="relative">
                            <UserButton
                                onClick={() => setShowUserDropdown(!showUserDropdown)}
                                title={isAuthenticated ? user?.name || "Mi Cuenta" : "Ingresar / Iniciar sesión"}
                                ariaLabel={isAuthenticated ? user?.name || "Perfil de usuario" : "Ingresar / Iniciar sesión"}
                                avatarUrl={isAuthenticated && user?.avatarUrl ? user.avatarUrl : null}
                                name={user?.name || user?.email || ""}
                                className="w-10 h-10 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 hover:border-cyan-400/40 shadow-sm"
                                iconClassName="w-5 h-5 sm:w-6 sm:h-6 text-slate-200 group-hover:text-white transition-colors"
                            />

                            {showUserDropdown && (
                                <div className="absolute right-0 mt-3 w-56 bg-slate-900/95 border border-white/10 rounded-2xl shadow-2xl p-2 z-50 backdrop-blur-md animate-fade-down">
                                    {isAuthenticated && user ? (
                                        <>
                                            <div className="p-3 border-b border-white/5 mb-1 bg-slate-950/40 rounded-xl">
                                                <p className="text-xs font-bold text-white truncate">{user.name}</p>
                                                <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                                            </div>
                                            <Link
                                                href="/admin"
                                                onClick={() => setShowUserDropdown(false)}
                                                className="flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                                            >
                                                <Svg icon="dashboard" fontSize="15px" color="#3b82f6" />
                                                <span>Panel de Control</span>
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    setShowUserDropdown(false);
                                                    logout();
                                                }}
                                                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer text-left"
                                            >
                                                <Svg icon="logout" fontSize="15px" color="currentColor" />
                                                <span>Cerrar Sesión</span>
                                            </button>
                                        </>
                                    ) : (
                                        <div className="space-y-1">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowUserDropdown(false);
                                                }}
                                                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-800/50 rounded-xl transition-all text-left cursor-default"
                                            >
                                                <Svg icon="user" fontSize="15px" color="#3b82f6" />
                                                <span>Iniciar Sesión</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowUserDropdown(false);
                                                }}
                                                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-bold text-white bg-blue-600/70 rounded-xl transition-all text-left cursor-default"
                                            >
                                                <Svg icon="plus" fontSize="14px" color="#ffffff" />
                                                <span>Registrarse</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu & User Button */}
                    <div className="md:hidden flex items-center gap-2">
                        <UserButton
                            onClick={() => setShowUserDropdown(!showUserDropdown)}
                            title={isAuthenticated ? user?.name || "Mi Cuenta" : "Ingresar / Iniciar sesión"}
                            ariaLabel={isAuthenticated ? user?.name || "Perfil de usuario" : "Ingresar / Iniciar sesión"}
                            avatarUrl={isAuthenticated && user?.avatarUrl ? user.avatarUrl : null}
                            name={user?.name || user?.email || ""}
                            className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-white/10"
                            iconClassName="w-5 h-5 text-slate-200"
                        />
                        <button
                            onClick={toggleMenu}
                            className="text-slate-300 hover:text-white focus:outline-none p-1.5"
                            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
                        >
                            <Svg icon={isOpen ? "cancel" : "menu"} fontSize="24px" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="md:hidden bg-[#0f172a] border-b border-white/5 shadow-2xl absolute w-full left-0 animate-fade-down animate-duration-300 z-50">
                    <div className="px-4 pt-3 pb-4 space-y-2">
                        {navLinks.map((link) => {
                            const isActive =
                                link.href === "/"
                                    ? pathname === "/"
                                    : pathname.startsWith(link.href);
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`block px-4 py-3 rounded-2xl transition-all duration-300 font-medium text-base uppercase tracking-wider ${
                                        isActive
                                            ? "bg-blue-600/25 border border-blue-400/40 text-cyan-300 font-bold shadow-[0_0_12px_rgba(59,130,246,0.3)]"
                                            : "text-slate-300 hover:text-white hover:bg-white/5"
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}

                        <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
                            {isAuthenticated && user ? (
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        logout();
                                    }}
                                    className="w-full py-3 px-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-300 text-sm font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <Svg icon="logout" fontSize="16px" color="currentColor" />
                                    <span>Cerrar Sesión ({user.name?.split(" ")[0]})</span>
                                </button>
                            ) : (
                                <div className="grid grid-cols-2 gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsOpen(false);
                                        }}
                                        className="py-3 px-4 bg-slate-800/80 text-slate-300 font-bold text-xs rounded-xl text-center cursor-default"
                                    >
                                        Iniciar Sesión
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsOpen(false);
                                        }}
                                        className="py-3 px-4 bg-blue-600/70 text-white font-bold text-xs rounded-xl text-center cursor-default"
                                    >
                                        Registrarse
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
