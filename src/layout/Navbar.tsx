"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button, Svg } from "@/components";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    const navLinks = [
        { name: "Inicio", href: "/" },
        { name: "Servicios", href: "/servicios" },
        { name: "Portafolio", href: "/portafolio" },
        { name: "Curiosidades", href: "/curiosidades" },
        { name: "Contacto", href: "/contacto" },
    ];

    return (
        <nav className="bg-[#0f172a]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="relative w-12 h-12 flex items-center justify-center">
                                <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-lg group-hover:bg-blue-500/40 transition-all duration-500"></div>
                                <div className="relative w-full h-full p-1 bg-slate-900/50 border border-white/10 rounded-xl backdrop-blur-sm group-hover:border-blue-500/50 transition-all duration-300">
                                    <img
                                        src="/images/icono_tec.png"
                                        alt="GP"
                                        className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-black text-white tracking-tighter leading-none group-hover:text-blue-400 transition-colors">
                                    SERVICIOS <span className="text-blue-500">GP</span>
                                </span>
                                <span className="text-[10px] text-slate-400 font-medium tracking-[0.2em] uppercase leading-none mt-1">
                                    Tecnología & Ciencia
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-slate-300 hover:text-blue-400 font-medium transition-colors text-sm uppercase tracking-wider"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link href="/login">
                            <Button
                                nameBtn="Admin"
                                variant="outlined"
                                radius="8px"
                                style={{ borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}
                            />
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMenu}
                            className="text-slate-300 hover:text-white focus:outline-none"
                        >
                            <Svg icon={isOpen ? "cancel" : "menu"} fontSize="24px" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="md:hidden bg-[#0f172a] border-b border-white/5 shadow-2xl absolute w-full left-0 animate-fade-down animate-duration-300">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="pt-4 pb-2 px-3">
                            <Link href="/login" onClick={() => setIsOpen(false)}>
                                <Button
                                    nameBtn="Acceso Admin"
                                    variant="outlined"
                                    radius="8px"
                                    style={{ width: "100%", borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}
                                />
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
