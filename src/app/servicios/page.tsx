"use client";

import React from "react";
import Link from "next/link";
import { Button, Card, CreativeSeparator, Svg } from "@/components";
import { servicesData } from "@/common/services";

export default function ServicesPage() {
    return (
        <div className="bg-[#0f172a] min-h-screen text-slate-300">
            {/* Header */}
            <section className="bg-slate-900/50 py-10 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto italic font-medium">
                        Soluciones integrales con un enfoque en la calidad, la escalabilidad y el éxito a largo plazo
                    </p>
                </div>
            </section>

            {/* Creative Separator */}
            <CreativeSeparator className="max-w-7xl mx-auto px-4 my-8" />

            {/* Services Grid */}
            <section className="pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {servicesData.map((service, index) => (
                            <Card key={index} className="p-8 border border-white/5 bg-white/5 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 rounded-2xl group hover:border-blue-500/20">
                                <div className="flex flex-col h-full gap-6">
                                    <div className={`w-[80px] h-[80px] rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-all shadow-lg overflow-hidden ${
                                        service.color === 'blue' ? 'bg-blue-600 shadow-blue-500/20' : 
                                        service.color === 'cyan' ? 'bg-cyan-600 shadow-cyan-500/20' : 
                                        'bg-indigo-600 shadow-indigo-500/20'
                                    }`}>
                                        {service.icon.includes('/') ? (
                                            <img src={service.icon} alt={service.title} className="w-full h-full object-cover p-2" />
                                        ) : (
                                            <Svg icon={service.icon} fontSize="32px" />
                                        )}
                                    </div>

                                    <div className="flex-grow">
                                        <h2 className="text-2xl font-bold mb-4 text-white">{service.title}</h2>
                                        <p className="text-slate-400 leading-relaxed mb-6">
                                            {service.description}
                                        </p>
                                    </div>

                                    {service.features && service.features.length > 0 && (
                                        <div className="grid grid-cols-1 gap-3 mb-2">
                                            {service.features.map((feature, fIndex) => (
                                                <div key={fIndex} className="flex items-center gap-2 text-sm text-slate-500">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${
                                                        service.color === 'blue' ? 'bg-blue-500' : 
                                                        service.color === 'cyan' ? 'bg-cyan-500' : 
                                                        'bg-indigo-500'
                                                    }`}></div>
                                                    {feature}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Projects Showcase */}
            <section className="py-24 bg-slate-900/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div className="max-w-2xl text-left">
                            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 italic text-left">Nuestro Trabajo en <span className="text-blue-400">Acción</span></h2>
                            <p className="text-slate-400 text-lg text-left">
                                Visualiza cómo transformamos ideas en plataformas robustas y funcionales a través de nuestros proyectos más recientes.
                            </p>
                        </div>
                        <Link href="/portafolio">
                            <Button nameBtn="Ver Portafolio Completo" variant="outlined" radius="10px" icon="plus" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { img: "/images/portfolio/nature-sumaq/tienda11.png", title: "E-commerce Nature Sumaq", cat: "Diseño Web & UX" },
                            { img: "/images/portfolio/inventario/auth_inventario.png", title: "Sistema de Inventario", cat: "Desarrollo de Software" },
                            { img: "/images/portfolio/agrodistrib/tienda-agro.png", title: "Plataforma AgroDistrib", cat: "Soluciones Empresariales" }
                        ].map((item, idx) => (
                            <div key={idx} className="group relative aspect-[4/3] rounded-3xl overflow-hidden border border-white/5 hover:border-blue-500/30 transition-all duration-500 shadow-2xl">
                                <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                                <div className="absolute bottom-0 left-0 p-6 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform text-left">
                                    <span className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-2 block text-left">{item.cat}</span>
                                    <h3 className="text-white font-bold text-xl text-left">{item.title}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Creative Separator */}
            <CreativeSeparator className="max-w-7xl mx-auto px-4 pb-12" />
        </div>
    );
}
