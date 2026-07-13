"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Svg } from "@/components";

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
                            <div className="relative w-16 h-16 flex items-center justify-center">
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

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-3">
                        {navLinks.map((link) => (
                            <Link key={link.name} href={link.href} className={`${navItemWrapper} px-3 py-2`}>
                                <span className={navItemBackground} aria-hidden="true" />
                                <span className={navItemText}>{link.name}</span>
                            </Link>
                        ))}
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
                    <div className="px-2 pt-2 pb-3 space-y-2 sm:px-3">
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
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
