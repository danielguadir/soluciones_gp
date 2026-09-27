"use client";

import React from "react";

export const PortfolioHeader: React.FC = () => {
    return (
        <section className="bg-slate-900/50 py-6 sm:py-8 border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black italic text-white tracking-tight">
                    Sitios y <span className="text-blue-400">Automatizaciones</span>
                </h1>
            </div>
        </section>
    );
};
