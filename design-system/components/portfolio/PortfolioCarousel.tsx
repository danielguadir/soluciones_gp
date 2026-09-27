"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button, Svg } from "@/components";
import { projectsData } from "@/data/portfolio";

export const PortfolioCarousel: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [activeImgIndex, setActiveImgIndex] = useState<Record<string, number>>({});

    const currentProject = projectsData[currentIndex];

    // Auto-play timer: transitions to next project every 3 seconds (3000ms)
    useEffect(() => {
        if (isPaused || projectsData.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % projectsData.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [isPaused, currentIndex]);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % projectsData.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + projectsData.length) % projectsData.length);
    };

    const handleSelectSlide = (index: number) => {
        setCurrentIndex(index);
    };

    if (!currentProject) return null;

    return (
        <section className="py-6 sm:py-8 pb-16 sm:pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Carousel Container */}
                <div
                    className="relative bg-slate-900/80 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-md shadow-2xl overflow-hidden group/carousel"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {/* Ambient Glows */}
                    <div className="absolute -top-24 -left-24 w-80 h-80 bg-blue-500/15 rounded-full blur-[100px] pointer-events-none"></div>
                    <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-indigo-500/15 rounded-full blur-[100px] pointer-events-none"></div>

                    {/* Main Project Slide Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[420px] relative z-10">
                        {/* Project Screenshot Display (7 Columns) */}
                        <div className="lg:col-span-7 relative group/img">
                            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 bg-slate-950 shadow-2xl">
                                <img
                                    src={currentProject.images[activeImgIndex[currentProject.id] || 0] || currentProject.images[0]}
                                    alt={currentProject.title}
                                    className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
                                />

                                {/* Thumbnail Switcher for Multiple Screenshots */}
                                {currentProject.images.length > 1 && (
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 px-3 py-1.5 bg-slate-950/80 backdrop-blur-md rounded-full border border-white/10 z-20">
                                        {currentProject.images.map((_, imgIdx) => (
                                            <button
                                                key={imgIdx}
                                                onClick={() => setActiveImgIndex({ ...activeImgIndex, [currentProject.id]: imgIdx })}
                                                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                                                    (activeImgIndex[currentProject.id] || 0) === imgIdx ? 'bg-blue-400 w-6' : 'bg-white/40 hover:bg-white w-2.5'
                                                }`}
                                                aria-label={`Imagen ${imgIdx + 1}`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Project Info & Description (5 Columns) */}
                        <div className="lg:col-span-5 flex flex-col gap-5 justify-between">
                            <div>
                                <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 mb-4 shadow-lg">
                                    <Svg icon={currentProject.icon} fontSize="24px" />
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-3">
                                    {currentProject.title}
                                </h2>
                                <p className="text-slate-300 text-sm leading-relaxed font-normal">
                                    {currentProject.description}
                                </p>
                            </div>

                            {/* Tech Badges */}
                            <div className="flex flex-wrap gap-2 my-2">
                                {currentProject.tech.map((tag, tIndex) => (
                                    <span key={tIndex} className="px-3 py-1 bg-blue-950/60 text-blue-400 text-[11px] font-bold rounded-lg uppercase tracking-wider border border-blue-500/20">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* CTA Action Button */}
                            <div className="pt-2">
                                <Link href={currentProject.link} target={currentProject.link === '#' ? '_self' : '_blank'}>
                                    <Button
                                        nameBtn={currentProject.link === '#' ? "Solicitar Demo" : "Explorar Proyecto"}
                                        variant={currentProject.link === '#' ? "outlined" : "contained"}
                                        radius="12px"
                                        icon={currentProject.link === '#' ? "mail" : "plus"}
                                        iconPosition="right"
                                        style={{ width: '100%', height: '48px', fontWeight: 'bold' }}
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Arrow Controls */}
                    <button
                        onClick={handlePrev}
                        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/90 hover:bg-blue-600 text-white flex items-center justify-center border border-white/10 shadow-2xl transition-all cursor-pointer z-30 group-hover/carousel:scale-110"
                        aria-label="Proyecto Anterior"
                    >
                        ❮
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/90 hover:bg-blue-600 text-white flex items-center justify-center border border-white/10 shadow-2xl transition-all cursor-pointer z-30 group-hover/carousel:scale-110"
                        aria-label="Siguiente Proyecto"
                    >
                        ❯
                    </button>

                    {/* Pagination Dots at Bottom */}
                    <div className="flex justify-center gap-2.5 mt-8 pt-4 border-t border-white/5 relative z-20">
                        {projectsData.map((proj, idx) => (
                            <button
                                key={proj.id}
                                onClick={() => handleSelectSlide(idx)}
                                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                                    currentIndex === idx
                                        ? "w-8 bg-blue-500 shadow-md shadow-blue-500/50"
                                        : "w-2.5 bg-slate-700 hover:bg-slate-500"
                                }`}
                                title={proj.title}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
