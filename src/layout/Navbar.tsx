"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Avatar, Svg } from "@/components";
import { useAuth } from "@/context/AuthContext";
import { DEFAULT_AVATAR_URL } from "@/lib/utils/constants";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const { user, isAuthenticated, openAuthModal, logout } = useAuth();

    const toggleMenu = () => setIsOpen(!isOpen);

    const navLinks = [
        { name: "Inicio", href: "/" },
        { name: "Servicios", href: "/servicios" },
        { name: "Portafolio", href: "/portafolio" },
        { name: "Curiosidades", href: "/curiosidades" },
        { name: "Contacto", href: "/contacto" },
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
                    <div className="hidden md:flex items-center space-x-3">
                        {navLinks.map((link) => (
                            <Link key={link.name} href={link.href} className={`${navItemWrapper} px-3 py-2`}>
                                <span className={navItemBackground} aria-hidden="true" />
                                <span className={navItemText}>{link.name}</span>
                            </Link>
                        ))}

                        <div className="h-5 w-[1px] bg-white/10 mx-2" aria-hidden="true" />

                        {isAuthenticated && user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 transition-all cursor-pointer group"
                                >
                                    <Avatar
                                        src={user.avatarUrl || DEFAULT_AVATAR_URL}
                                        name={user.name || user.email}
                                        size={28}
                                        className="border border-blue-400/40"
                                    />
                                    <span className="text-xs font-bold text-white max-w-[100px] truncate">
                                        {user.name?.split(" ")[0] || "Mi Cuenta"}
                                    </span>
                                    <Svg icon="caret-down" fontSize="12px" className="text-slate-400 group-hover:text-white" />
                                </button>

                                {showUserDropdown && (
                                    <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-2 z-50 animate-fade-down">
                                        <div className="p-3 border-b border-white/5 mb-1">
                                            <p className="text-xs font-bold text-white truncate">{user.name}</p>
                                            <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                                        </div>
                                        <Link
                                            href="/admin"
                                            onClick={() => setShowUserDropdown(false)}
                                            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                                        >
                                            <Svg icon="dashboard" fontSize="14px" />
                                            <span>Panel de Control</span>
                                        </Link>
                                        <button
                                            onClick={() => {
                                                setShowUserDropdown(false);
                                                logout();
                                            }}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                                        >
                                            <Svg icon="logout" fontSize="14px" color="currentColor" />
                                            <span>Cerrar Sesión</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => openAuthModal("login")}
                                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                                >
                                    Iniciar Sesión
                                </button>
                                <button
                                    onClick={() => openAuthModal("register")}
                                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                                >
                                    Registrarse
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-2">
                        {isAuthenticated && user && (
                            <Avatar
                                src={user.avatarUrl || DEFAULT_AVATAR_URL}
                                name={user.name || user.email}
                                size={32}
                                className="border border-blue-400/40"
                            />
                        )}
                        <button
                            onClick={toggleMenu}
                            className="text-slate-300 hover:text-white focus:outline-none p-1"
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
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className={`${navItemWrapper} block px-4 py-3 bg-white/0 rounded-2xl`}
                            >
                                <span className={navItemBackground} aria-hidden="true" />
                                <span className="relative text-slate-300 group-hover:text-white font-medium transition-colors duration-300 text-base uppercase tracking-wider">
                                    {link.name}
                                </span>
                            </Link>
                        ))}

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
                                        onClick={() => {
                                            setIsOpen(false);
                                            openAuthModal("login");
                                        }}
                                        className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl text-center cursor-pointer"
                                    >
                                        Iniciar Sesión
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsOpen(false);
                                            openAuthModal("register");
                                        }}
                                        className="py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl text-center cursor-pointer shadow-lg shadow-blue-500/20"
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
