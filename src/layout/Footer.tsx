"use client";

import React from "react";
import Link from "next/link";
import { Svg } from "@/components";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#0f172a] text-slate-400 py-16 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand section */}
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-6 group">
                            <div className="w-[133px] h-[133px] group-hover:scale-110 transition-transform drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]">
                                <img src="/images/icono_tec.png" alt="GP" className="w-full h-full object-contain" />
                            </div>
                            <span className="text-xl font-bold text-white italic">Servicios GP</span>
                        </Link>
                        <p className="text-sm leading-relaxed text-slate-500">
                            Soluciones y servicios
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Enlaces</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/" className="hover:text-blue-400 transition-colors">Inicio</Link></li>
                            <li><Link href="/servicios" className="hover:text-blue-400 transition-colors">Servicios</Link></li>
                            <li><Link href="/portafolio" className="hover:text-blue-400 transition-colors">Portafolio</Link></li>
                            <li><Link href="/contacto" className="hover:text-blue-400 transition-colors">Contacto</Link></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Especialidades</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/servicios" className="hover:text-blue-400 transition-colors">Clases de Matemáticas</Link></li>
                            <li><Link href="/servicios" className="hover:text-blue-400 transition-colors">Desarrollo Web</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Contacto Directo</h3>
                        <div className="space-y-4 text-sm">
                            <div className="flex items-center gap-3 font-semibold text-white group">
                                <Svg icon="whatsapp" fontSize="20px" color="#25D366" />
                                <a href="https://wa.me/573148029030" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                                    +57 314 802 9030
                                </a>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3 text-[12px]">
                                    <Svg icon="mail" fontSize="14px" color="#3b82f6" style={{ opacity: 0.7 }} />
                                    <span>danielguadir98@gmail.com</span>
                                </div>
                                <div className="flex items-center gap-3 text-[12px]">
                                    <Svg icon="mail" fontSize="14px" color="#3b82f6" style={{ opacity: 0.7 }} />
                                    <span>daniel.guadir@correounivalle.edu.co</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3">
                                    <Svg icon="location" fontSize="18px" color="#3b82f6" style={{ opacity: 0.7 }} />
                                    <span>Valle del Cauca - Cali</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Svg icon="location" fontSize="18px" color="#3b82f6" style={{ opacity: 0.7 }} />
                                    <span>Nariño - Cumbal</span>
                                </div>
                            </div>
                            <div className="flex gap-4 mt-8">
                                <a href="#" className="w-9 h-9 bg-white/5 rounded-full flex items-center justify-center hover:bg-blue-600 transition-all border border-white/5">
                                    <Svg icon="linkedin" fontSize="16px" color="#fff" />
                                </a>
                                <a href="#" className="w-9 h-9 bg-white/5 rounded-full flex items-center justify-center hover:bg-white group transition-all border border-white/5">
                                    <Svg icon="github" fontSize="16px" color="#fff" className="group-hover:text-slate-900" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-600 uppercase tracking-widest font-bold">
                    <p>© {currentYear} Servicios GP.</p>

                    <div className="flex gap-6">
                        <Link href="/privacidad" className="hover:text-white transition-colors">Privacidad</Link>
                        <Link href="/terminos" className="hover:text-white transition-colors">Términos</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
