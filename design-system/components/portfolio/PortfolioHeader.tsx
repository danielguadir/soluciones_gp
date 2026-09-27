"use client";

import React from "react";

export const PortfolioHeader: React.FC = () => {
    return (
        <section className="bg-slate-900/50 py-12 border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight">
                    Sitios <span className="text-blue-400">Desarrollados</span>
                </h1>
            </div>
        </section>
    );
};
