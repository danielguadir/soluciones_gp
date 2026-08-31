"use client";

import React from "react";
import { Card, CreativeSeparator, Svg } from "@/components";
import { servicesData } from "@/common/services";

export default function ServicesPage() {
    return (
        <div className="bg-[#0f172a] min-h-screen text-slate-300">
            {/* Header */}
            <section className="bg-slate-900/50 py-10 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto italic font-medium">
                        Soluciones integrales con un enfoque en la calidad, la escalabilidad y el éxito a largo plazo
                    </p>
                </div>
            </section>

            {/* Creative Separator */}
            <CreativeSeparator className="max-w-7xl mx-auto px-4 my-8" />

            {/* Services Grid */}
            <section className="pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {servicesData.map((service, index) => (
                            <Card key={index} className="p-8 border border-white/5 bg-white/5 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 rounded-2xl group hover:border-blue-500/20">
                                <div className="flex flex-col h-full gap-6">
                                    <div className={`w-[80px] h-[80px] rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-all shadow-lg overflow-hidden ${
                                        service.color === 'blue' ? 'bg-blue-600 shadow-blue-500/20' : 
                                        service.color === 'cyan' ? 'bg-cyan-600 shadow-cyan-500/20' : 
                                        'bg-indigo-600 shadow-indigo-500/20'
                                    }`}>
                                        {service.icon.includes('/') ? (
                                            <img src={service.icon} alt={service.title} className="w-full h-full object-cover p-2" />
                                        ) : (
                                            <Svg icon={service.icon} fontSize="32px" />
                                        )}
                                    </div>

                                    <div className="flex-grow">
                                        <h2 className="text-2xl font-bold mb-4 text-white">{service.title}</h2>
                                        <p className="text-slate-400 leading-relaxed mb-6">
                                            {service.description}
                                        </p>
                                    </div>

                                    {service.features && service.features.length > 0 && (
                                        <div className="grid grid-cols-1 gap-3 mb-2">
                                            {service.features.map((feature, fIndex) => (
                                                <div key={fIndex} className="flex items-center gap-2 text-sm text-slate-500">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${
                                                        service.color === 'blue' ? 'bg-blue-500' : 
                                                        service.color === 'cyan' ? 'bg-cyan-500' : 
                                                        'bg-indigo-500'
                                                    }`}></div>
                                                    {feature}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Creative Separator */}
            <CreativeSeparator className="max-w-7xl mx-auto px-4 pb-12" />
        </div>
    );
}
