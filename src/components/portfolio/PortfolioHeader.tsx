"use client";

import React from "react";

export const PortfolioHeader: React.FC = () => {
    return (
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
    );
};
