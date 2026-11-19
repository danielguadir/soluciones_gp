"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  RubikCircularHandle,
  RubikCircularSvg,
} from "@/components/hero/RubikCircularSvg";

export function InteractiveHero() {
  const rubikRef = useRef<RubikCircularHandle | null>(null);
  const visualizerSectionRef = useRef<HTMLDivElement | null>(null);

  const handleExploreExperience = () => {
    if (visualizerSectionRef.current) {
      visualizerSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
    rubikRef.current?.triggerDemoSequence();
  };

  return (
    <section className="relative min-h-[78vh] lg:min-h-[90vh] flex flex-col justify-center overflow-hidden bg-[#0f172a] bg-grid-white py-12 lg:py-16">
      {/* Animated Background Elements (preserving brand chromatic identity) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-72 h-72 bg-blue-600/20 rounded-full blur-[120px] animate-blob" />
        <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] animate-blob animation-delay-2000" />
        <div className="absolute top-[40%] right-[20%] w-64 h-64 bg-cyan-600/10 rounded-full blur-[100px] animate-blob animation-delay-4000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Title, Enterprise Description, Action Buttons & Complementary Infinity Visual */}
          <div className="lg:col-span-6 flex flex-col gap-6 lg:gap-7 relative z-20">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
              </span>
              <span>Ingeniería · Matemáticas · Software</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.08] tracking-tight">
              La lógica en{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 text-glow">
                movimiento.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 max-w-xl leading-relaxed font-normal">
              Transformamos ideas en soluciones digitales mediante matemáticas,
              creatividad y desarrollo de software.
            </p>

            {/* Primary CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button
                type="button"
                onClick={handleExploreExperience}
                className="px-6 py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40 transition-all duration-300 flex items-center gap-2.5 cursor-pointer"
              >
                <span>Explorar experiencia</span>
                <span aria-hidden="true">→</span>
              </button>

              <Link
                href="/servicios"
                className="px-6 py-3.5 rounded-2xl font-bold text-sm text-slate-200 hover:text-white bg-slate-900/70 hover:bg-slate-800/90 border border-white/15 hover:border-blue-400/40 transition-all duration-300"
              >
                Nuestros servicios
              </Link>
            </div>

            {/* Complementary Infinity Symbol Card (Preserved Visual Identity & Transition Element) */}
            <div className="mt-2 pt-4 border-t border-white/10 flex items-center gap-4 max-w-lg">
              <div className="relative w-20 h-14 sm:w-24 sm:h-16 flex-shrink-0 rounded-2xl overflow-hidden bg-slate-900/70 border border-white/10 p-1.5 shadow-md group">
                <Image
                  src="/images/hero/inicio1_pw.png"
                  alt="ImpulsoGP Símbolo de Infinito"
                  fill
                  priority
                  sizes="96px"
                  className="object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="text-xs sm:text-sm text-slate-400 leading-snug">
                <strong className="text-slate-200 font-semibold">
                  Precisión algorítmica:
                </strong>{" "}
                cada giro opera sobre las 54 posiciones reales del grupo del cubo
                en 9 órbitas circulares.
              </p>
            </div>
          </div>

          {/* Right Column: 2D Circular Interactive Rubik's Cube SVG */}
          <div
            ref={visualizerSectionRef}
            className="lg:col-span-6 relative z-20 flex items-center justify-center"
          >
            <RubikCircularSvg ref={rubikRef} />
          </div>
        </div>
      </div>
    </section>
  );
}
