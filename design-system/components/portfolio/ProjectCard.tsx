"use client";

import React from "react";
import Link from "next/link";
import { Button, Card, Svg } from "@/components";
import { Project } from "@/data/portfolio";

interface ProjectCardProps {
    project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    return (
        <Card className="group p-8 border border-white/5 hover:shadow-2xl transition-all duration-500 rounded-3xl bg-white/5 backdrop-blur-sm relative overflow-hidden hover:border-blue-500/20">
            {/* Background Icon Watermark */}
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
                                    className="w-full h-full object-contain p-2 transition-transform duration-700"
                                />
                            </div>
                        ))}
                    </div>
                    {project.images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10 pointer-events-none">
                            {project.images.map((_, i) => (
                                <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-blue-400' : 'bg-white/40'}`}></div>
                            ))}
                        </div>
                    )}
                    <div className="absolute top-4 right-4 px-3 py-1 bg-blue-600/90 backdrop-blur-md rounded-lg text-[10px] font-bold text-white uppercase tracking-widest border border-blue-400/30">
                        Preview
                    </div>
                </div>

                {/* Header Information */}
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

                {/* Technologies Tags */}
                <div className="flex flex-wrap gap-2">
                    {project.tech.map((tag, tIndex) => (
                        <span key={tIndex} className="px-3 py-1 bg-blue-900/20 text-blue-400 text-[10px] font-bold rounded-lg uppercase tracking-wider border border-blue-500/10">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* CTA Button */}
                <div className="pt-4 mt-auto flex items-center">
                    <Link
                        href={project.link}
                        target={project.link === '#' ? '_self' : '_blank'}
                        className="w-12 h-12 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-2xl font-bold flex items-center justify-center shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 active:scale-95 transition-all duration-300 border border-blue-400/30 cursor-pointer"
                        title={project.link === '#' ? "Solicitar Demo" : "Explorar Proyecto"}
                        aria-label="Abrir proyecto"
                    >
                        +
                    </Link>
                </div>
            </div>
        </Card>
    );
};
