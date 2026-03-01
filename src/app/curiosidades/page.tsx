"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Card, Svg } from "@/components";

import { curiosities, type Category } from "@/data/curiosities";

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

    const shareOnFacebook = (id: number, title: string) => {
        const url = `https://www.impulsogp.com/curiosidades/${id}`;
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`, '_blank');
    };

    const shareOnWhatsApp = (id: number, title: string) => {
        const url = `https://www.impulsogp.com/curiosidades/${id}`;
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
                                        onClick={() => shareOnFacebook(item.id, item.title)}
                                        className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-all duration-300"
                                        title="Compartir en Facebook"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => shareOnWhatsApp(item.id, item.title)}
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
