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
        { name: "Contacto", href: "/contacto" },
    ];

    return (
        <nav className="bg-[#0f172a]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 group-hover:scale-110 transition-transform">
                                <img src="/images/icono_tec.png" alt="GP" className="w-full h-full object-contain" />
                            </div>
                            <span className="text-xl font-bold text-white hidden sm:block italic">
                                Servicios GP
                            </span>
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
