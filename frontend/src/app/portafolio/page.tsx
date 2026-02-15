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
        <div className="bg-white min-h-screen">
            {/* Header */}
            <section className="bg-gray-50 py-20 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 italic">
                        Mi <span className="text-blue-600">Portafolio</span> de Proyectos
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto italic">
                        Una colección de soluciones tecnológicas diseñadas para resolver problemas reales con arquitecturas escalables y mantenibles.
                    </p>
                </div>
            </section>

            {/* Projects Grid */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
                        {projects.map((project, index) => (
                            <Card key={index} className="group p-8 border border-gray-100 hover:shadow-2xl transition-all duration-500 rounded-3xl bg-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Svg icon={project.icon} fontSize="120px" />
                                </div>

                                <div className="flex flex-col gap-6 relative z-10">
                                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                        <Svg icon={project.icon} fontSize="32px" />
                                    </div>

                                    <div>
                                        <h2 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-blue-600 transition-colors">
                                            {project.title}
                                        </h2>
                                        <p className="text-gray-600 leading-relaxed mb-6 font-medium">
                                            {project.description}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-8">
                                        {project.tech.map((tag, tIndex) => (
                                            <span key={tIndex} className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-wider">
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
                <div className="bg-blue-600 rounded-[40px] p-12 text-center text-white shadow-2xl shadow-blue-200">
                    <h2 className="text-3xl font-bold mb-6 italic">¿Tienes un reto tecnológico para nosotros?</h2>
                    <p className="text-blue-100 mb-10 text-lg max-w-2xl mx-auto">
                        Estamos listos para aplicar nuestra experiencia en el desarrollo de tu próximo sistema de alta complejidad.
                    </p>
                    <Link href="/contacto">
                        <Button
                            nameBtn="Hablemos de tu idea"
                            variant="outlined"
                            style={{ borderColor: '#fff', color: '#fff', borderWeight: '2px' }}
                            radius="12px"
                        />
                    </Link>
                </div>
            </section>
        </div>
    );
}
