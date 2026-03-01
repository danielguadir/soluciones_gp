"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button, Card, Svg } from "@/components";

type Category = "Historia" | "Tecnología" | "Matemáticas" | "Agricultura" | "Todas";

interface Curiosity {
    id: number;
    category: Category;
    title: string;
    content: string[];
    date: string;
}

const curiosities: Curiosity[] = [
    {
        id: 1,
        category: "Historia",
        title: "Eratóstenes y el Diámetro de la Tierra",
        date: "Siglo III a.C.",
        content: [
            "Eratóstenes de Cirene fue un matemático, astrónomo y geógrafo griego que logró una hazaña asombrosa: medir la circunferencia de la Tierra con una precisión sorprendente utilizando únicamente la sombra de un palo y la geometría básica. Su método se basó en la observación de que en el solsticio de verano, al mediodía, el Sol se encontraba directamente sobre la ciudad de Siena (hoy Asuán), donde la luz llegaba al fondo de un pozo profundo sin proyectar sombras.",
            "Al mismo tiempo, en la ciudad de Alejandría, situada al norte, los objetos sí proyectaban sombra. Eratóstenes midió el ángulo de esta sombra y determinó que era de aproximadamente 7.2 grados, lo que representaba una quincuagésima parte de un círculo completo (360 grados). Al conocer que la distancia entre Siena y Alejandría era de unos 5,000 estadios, simplemente multiplicó esa distancia por 50 para obtener la circunferencia total del planeta.",
            "Este razonamiento lógico, basado en el supuesto de que la Tierra era esférica y que los rayos del Sol eran paralelos, le permitió calcular que la circunferencia terrestre era de unos 250,000 estadios. Aunque existe un debate sobre la longitud precisa de un 'estadio' en aquella época, las estimaciones sugieren que su error fue de apenas entre un 1% y un 15% respecto al valor real de 40,075 kilómetros.",
            "El experimento de Eratóstenes es considerado uno de los hitos más importantes en la historia de la ciencia, no solo por el resultado obtenido, sino por demostrar que el ingenio humano, apoyado en el rigor matemático y la observación cuidadosa, puede desentrañar los secretos más grandes de la naturaleza incluso con los recursos más limitados."
        ]
    },
    {
        id: 2,
        category: "Tecnología",
        title: "La Evolución de la Web",
        date: "2024",
        content: [
            "Desde la Web 1.0 estática hasta la Web 3.0 descentralizada, la tecnología ha transformado cómo interactuamos con la información. La IA ahora permite interfaces dinámicas que se adaptan en tiempo real a las necesidades del usuario."
        ]
    }
];

export default function CuriositiesPage() {
    const [activeCategory, setActiveCategory] = useState<Category>("Todas");

    const categories: Category[] = ["Todas", "Historia", "Tecnología", "Matemáticas", "Agricultura"];

    const filteredCuriosities = activeCategory === "Todas"
        ? curiosities
        : curiosities.filter(c => c.category === activeCategory);

    return (
        <div className="bg-[#0f172a] min-h-screen text-slate-300 pb-20">
            {/* Header */}
            <section className="bg-slate-900/50 py-20 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-6">
                        Curiosidades
                    </h1>
                    <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                        Explorando los hitos de la historia, la tecnología y el conocimiento.
                    </p>
                </div>
            </section>

            {/* Filter Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-16">
                <div className="flex flex-wrap justify-center gap-4">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-2 rounded-full font-bold transition-all border ${activeCategory === cat
                                    ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20"
                                    : "bg-slate-900/50 border-white/10 text-slate-400 hover:border-white/20"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content List */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                {filteredCuriosities.length > 0 ? (
                    filteredCuriosities.map((item) => (
                        <Card key={item.id} className="p-10 bg-white/5 backdrop-blur-md rounded-[40px] border border-white/10 overflow-hidden relative group">
                            <div className="absolute top-0 right-0 p-8 text-white/5 pointer-events-none group-hover:text-blue-500/10 transition-colors">
                                <Svg icon="target" fontSize="150px" />
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded-full uppercase tracking-widest border border-blue-500/20">
                                        {item.category}
                                    </span>
                                    <span className="text-slate-500 text-xs font-medium uppercase tracking-widest">
                                        {item.date}
                                    </span>
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-8 group-hover:text-blue-400 transition-colors italic">
                                    {item.title}
                                </h2>
                                <div className="space-y-6">
                                    {item.content.map((p, i) => (
                                        <p key={i} className="text-lg text-slate-400 leading-relaxed text-justify">
                                            {p}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-20">
                        <p className="text-slate-500 text-xl">Próximamente más contenido en esta categoría.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
