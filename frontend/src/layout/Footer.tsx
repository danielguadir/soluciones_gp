"use client";

import React from "react";
import Link from "next/link";
import { Svg } from "@/components";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-gray-300 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand section */}
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                GP
                            </div>
                            <span className="text-xl font-bold text-white">Servicios GP</span>
                        </Link>
                        <p className="text-sm leading-relaxed text-gray-400">
                            Soluciones integrales de software y servicios tecnológicos personalizados para potenciar tu negocio.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Enlaces</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/" className="hover:text-blue-400 transition-colors">Inicio</Link></li>
                            <li><Link href="/servicios" className="hover:text-blue-400 transition-colors">Servicios</Link></li>
                            <li><Link href="/portafolio" className="hover:text-blue-400 transition-colors">Portafolio</Link></li>
                            <li><Link href="/contacto" className="hover:text-blue-400 transition-colors">Contacto</Link></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Servicios Populares</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="text-gray-400">Desarrollo Web Fullstack</li>
                            <li className="text-gray-400">Arquitectura de Software</li>
                            <li className="text-gray-400">Consultoría Técnica</li>
                            <li className="text-gray-400">Integración de Sistemas</li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Contacto</h3>
                        <div className="space-y-4 text-sm">
                            <div className="flex items-center gap-3 font-semibold text-white">
                                <Svg icon="whatsapp" fontSize="18px" color="#25D366" />
                                <a href="https://wa.me/573148029030" target="_blank" rel="noopener noreferrer">
                                    +57 314 802 9030
                                </a>
                            </div>
                            <div className="flex items-center gap-3">
                                <Svg icon="mail" fontSize="16px" color="var(--clr-blue-light)" />
                                <span>contacto@serviciosgp.com</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Svg icon="location" fontSize="16px" color="var(--clr-blue-light)" />
                                <span>Bogotá, Colombia</span>
                            </div>
                            <div className="flex gap-4 mt-6">
                                <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                                    <Svg icon="linkedin" fontSize="14px" color="#fff" />
                                </a>
                                <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-100 group transition-colors">
                                    <Svg icon="github" fontSize="14px" color="#fff" className="group-hover:text-gray-900" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 uppercase tracking-widest">
                    <p>© {currentYear} Servicios GP. Todos los derechos reservados.</p>
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
