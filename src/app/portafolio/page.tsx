"use client";

import React from "react";
import Link from "next/link";
import { Button, Card, Svg } from "@/components";

const projects = [
    {
        title: "Automatización de Inventario de Equipos Tecnológicos",
        description: "Sistema integral desarrollado para la gestión automatizada de activos de hardware y la optimización de la comunicación estratégica con proveedores tecnológicos.",
        icon: "database",
        link: "https://inventory-frontend-pi-two.vercel.app",
        tech: ["Next.js", "Prisma", "Automation", "Inventory SQL"]
    }
];

export default function PortfolioPage() {
    return (
        <div className="bg-[#0f172a] min-h-screen text-slate-300">
            {/* Header */}
            <section className="bg-slate-900/50 py-20 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 italic">
                        Mi <span className="text-blue-400">Portafolio</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-3xl mx-auto italic">
                        Soluciones diseñadas para resolver problemas
                    </p>
                </div>
            </section>

            {/* Projects Grid */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
                        {projects.map((project, index) => (
                            <Card key={index} className="group p-8 border border-white/5 hover:shadow-2xl transition-all duration-500 rounded-3xl bg-white/5 backdrop-blur-sm relative overflow-hidden hover:border-blue-500/20">
                                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Svg icon={project.icon} fontSize="120px" />
                                </div>

                                <div className="flex flex-col gap-6 relative z-10">
                                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                                        <Svg icon={project.icon} fontSize="32px" />
                                    </div>

                                    <div>
                                        <h2 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors">
                                            {project.title}
                                        </h2>
                                        <p className="text-slate-400 leading-relaxed mb-6 font-medium">
                                            {project.description}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-8">
                                        {project.tech.map((tag, tIndex) => (
                                            <span key={tIndex} className="px-3 py-1 bg-blue-900/30 text-blue-400 text-xs font-bold rounded-full uppercase tracking-wider border border-blue-500/20">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <Link href={project.link} target="_blank">
                                        <Button
                                            nameBtn="Explorar Proyecto"
                                            variant="contained"
                                            radius="12px"
                                            icon="plus"
                                            iconPosition="right"
                                            style={{ padding: '0 24px' }}
                                        />
                                    </Link>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Curiosity CTA */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className="bg-slate-900/80 border border-white/5 rounded-[40px] p-12 text-center text-white shadow-2xl">
                    <h2 className="text-3xl font-bold mb-6 italic">¿Tienes un reto tecnológico para nosotros?</h2>
                    <p className="text-slate-400 mb-10 text-lg max-w-2xl mx-auto">
                        Estamos listos para aplicar nuestra experiencia en el desarrollo de tu próximo sistema de alta complejidad.
                    </p>
                    <Link href="/contacto">
                        <Button
                            nameBtn="Hablemos de tu idea"
                            variant="outlined"
                            style={{ borderColor: '#3b82f6', color: '#3b82f6', borderWidth: '2px' }}
                            radius="12px"
                        />
                    </Link>
                </div>
            </section>
        </div>
    );
}
