"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components";

export const PortfolioCTA: React.FC = () => {
    return (
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
    );
};
