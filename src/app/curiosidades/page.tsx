"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
    },
    {
        id: 3,
        category: "Matemáticas",
        title: "La Paradoja del Cumpleaños",
        date: "Teoría de Probabilidades",
        content: [
            "La Paradoja del Cumpleaños es uno de los fenómenos más contraintuitivos en el campo de la estadística. Establece que en un grupo de tan solo 23 personas, existe una probabilidad superior al 50% de que al menos dos de ellas compartan la misma fecha de nacimiento. Aunque a simple vista parece que se necesitarían cientos de personas para que esto ocurra, la matemática nos revela una realidad muy distinta.",
            "Este fenómeno se explica mediante la probabilidad complementaria: en lugar de calcular la probabilidad de que alguien comparta tu cumpleaños, calculamos la probabilidad de que nadie comparta fecha con nadie más. A medida que el grupo crece, el número de parejas posibles aumenta de forma exponencial (n*(n-1)/2). Para 23 personas, existen 253 combinaciones posibles de parejas, lo que eleva drásticamente las oportunidades de coincidencia.",
            "La fórmula matemática fundamental para calcular la probabilidad de que NO haya coincidencias es: P(A) = 365/365 * 364/365 * 363/365 * ... * (365-n+1)/365. Al restar este resultado de 1, obtenemos la probabilidad de éxito. Para n=23, el resultado es aproximadamente 0.5073, superando el umbral del 50%.",
            "Entender esta paradoja es vital en áreas como la criptografía y la ciberseguridad, donde se utiliza para comprender las colisiones en funciones hash. Demuestra que nuestra intuición a menudo falla cuando se enfrenta a crecimientos exponenciales y combinatorias complejas, resaltando la importancia del rigor matemático sobre las suposiciones cotidianas."
        ]
    }
];

function CuriositiesContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [activeCategory, setActiveCategory] = useState<Category>("Todas");

    useEffect(() => {
        const cat = searchParams.get("cat") as Category;
        if (cat && ["Todas", "Historia", "Tecnología", "Matemáticas", "Agricultura"].includes(cat)) {
            setActiveCategory(cat);
        }
    }, [searchParams]);

    const handleCategoryChange = (cat: Category) => {
        setActiveCategory(cat);
        router.push(`/curiosidades?cat=${cat}`, { scroll: false });
    };

    const categories: Category[] = ["Todas", "Historia", "Tecnología", "Matemáticas", "Agricultura"];

    const filteredCuriosities = activeCategory === "Todas"
        ? curiosities
        : curiosities.filter(c => c.category === activeCategory);

    const shareOnFacebook = (title: string) => {
        const url = window.location.href;
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`, '_blank');
    };

    const shareOnWhatsApp = (title: string) => {
        const url = window.location.href;
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + url)}`, '_blank');
    };

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
                            onClick={() => handleCategoryChange(cat)}
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
                                <div className="flex items-center gap-4 mb-6 text-left">
                                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded-full uppercase tracking-widest border border-blue-500/20">
                                        {item.category}
                                    </span>
                                    <span className="text-slate-500 text-xs font-medium uppercase tracking-widest">
                                        {item.date}
                                    </span>
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-8 group-hover:text-blue-400 transition-colors italic text-left">
                                    {item.title}
                                </h2>
                                <div className="space-y-6">
                                    {item.content.map((p, i) => (
                                        <p key={i} className="text-lg text-slate-400 leading-relaxed text-justify">
                                            {p}
                                        </p>
                                    ))}
                                </div>

                                {/* Social Sharing Buttons */}
                                <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-center gap-4">
                                    <button
                                        onClick={() => shareOnFacebook(item.title)}
                                        className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-all duration-300"
                                        title="Compartir en Facebook"
                                    >
                                        <Svg icon="facebook" fontSize="18px" />
                                    </button>
                                    <button
                                        onClick={() => shareOnWhatsApp(item.title)}
                                        className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-all duration-300"
                                        title="Compartir en WhatsApp"
                                    >
                                        <Svg icon="whatsapp" fontSize="18px" />
                                    </button>
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

export default function CuriositiesPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">Cargando curiosidades...</div>}>
            <CuriositiesContent />
        </Suspense>
    );
}
