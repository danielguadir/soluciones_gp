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
        tech: ["Next.js", "Prisma", "Automation", "Inventory SQL"],
        images: ["/images/portfolio/inventario/auth_inventario.png", "/images/portfolio/inventario/cont_inventario.png"]
    },
    {
        title: "Nature Sumaq: E-commerce de Belleza Natural",
        description: "Plataforma de comercio electrónico dedicada a productos de cuidado personal y belleza natural, con un diseño fresco y enfocado en la experiencia del usuario.",
        icon: "cart",
        link: "#",
        tech: ["Next.js", "Tailwind CSS", "E-commerce"],
        images: ["/images/portfolio/nature-sumaq/tienda1.jpg", "/images/portfolio/nature-sumaq/tienda11.png", "/images/portfolio/nature-sumaq/tienda111.jpg"]
    },
    {
        title: "AgroDistrib: Distribuidora Agropecuaria",
        description: "Solución digital para la gestión y venta de productos del sector agropecuario, facilitando la conexión entre proveedores y el campo.",
        icon: "chart-pie",
        link: "#",
        tech: ["Next.js", "Business Suite", "Agriculture Tech"],
        images: ["/images/portfolio/agrodistrib/tienda-agro.png"]
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
                        Soluciones web diseñadas para resolver problemas, impulsar la visibilidad y fortalecer tu presencia en internet.
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
                                    {/* Image Preview / Gallery */}
                                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 bg-slate-900 shadow-inner group/gallery">
                                        <div className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                                            {project.images.map((img, i) => (
                                                <div key={i} className="flex-shrink-0 w-full h-full snap-center relative">
                                                    <img
                                                        src={img}
                                                        alt={`${project.title} screenshot ${i + 1}`}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover/gallery:scale-105"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        {project.images.length > 1 && (
                                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10 pointer-events-none">
                                                {project.images.map((_, i) => (
                                                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/40 first:bg-blue-400"></div>
                                                ))}
                                            </div>
                                        )}
                                        <div className="absolute top-4 right-4 px-3 py-1 bg-blue-600/90 backdrop-blur-md rounded-lg text-[10px] font-bold text-white uppercase tracking-widest border border-blue-400/30">
                                            Preview
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 shadow-lg group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                            <Svg icon={project.icon} fontSize="28px" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors leading-tight">
                                            {project.title}
                                        </h2>
                                    </div>

                                    <p className="text-slate-400 leading-relaxed font-medium">
                                        {project.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        {project.tech.map((tag, tIndex) => (
                                            <span key={tIndex} className="px-3 py-1 bg-blue-900/20 text-blue-400 text-[10px] font-bold rounded-lg uppercase tracking-wider border border-blue-500/10">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="pt-4 mt-auto">
                                        <Link href={project.link} target={project.link === '#' ? '_self' : '_blank'}>
                                            <Button
                                                nameBtn={project.link === '#' ? "Solicitar Demo" : "Explorar Proyecto"}
                                                variant={project.link === '#' ? "outlined" : "contained"}
                                                radius="12px"
                                                icon={project.link === '#' ? "mail" : "plus"}
                                                iconPosition="right"
                                                style={{ width: '100%', height: '50px' }}
                                            />
                                        </Link>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Curiosity CTA */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className="bg-slate-900/80 border border-white/5 rounded-[40px] p-12 text-center text-white shadow-2xl">
                    <h2 className="text-3xl font-bold mb-6 italic">¿Tienes un reto?</h2>
                    <p className="text-slate-400 mb-10 text-lg max-w-2xl mx-auto">
                        ¡Estamos listos!
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
