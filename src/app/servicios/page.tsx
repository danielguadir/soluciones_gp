"use client";

import React from "react";
import Link from "next/link";
import { Button, Card, Svg } from "@/components";

const servicesList: any[] = [];

export default function ServicesPage() {
    return (
        <div className="bg-[#0f172a] min-h-screen text-slate-300">
            {/* Header */}
            <section className="bg-slate-900/50 py-20 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-6">
                        Servicios
                    </h1>
                    <p className="text-xl text-slate-400 max-w-3xl mx-auto italic">
                        Ofrecemos soluciones integrales con un enfoque en la calidad, la escalabilidad y el éxito a largo plazo de tu negocio.
                    </p>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {servicesList.map((service, index) => (
                            <Card key={index} className="p-8 border border-white/5 bg-white/5 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 rounded-2xl group hover:border-blue-500/20">
                                <div className="flex flex-col gap-6">
                                    <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
                                        <Svg icon={service.icon} fontSize="28px" />
                                    </div>

                                    <div>
                                        <h2 className="text-2xl font-bold mb-4 text-white">{service.title}</h2>
                                        <p className="text-slate-400 leading-relaxed mb-6">
                                            {service.description}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mb-6">
                                        {service.features.map((feature, fIndex) => (
                                            <div key={fIndex} className="flex items-center gap-2 text-sm text-slate-500">
                                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                                {feature}
                                            </div>
                                        ))}
                                    </div>

                                    <Link href={`/contacto?service=${encodeURIComponent(service.title)}`}>
                                        <Button
                                            nameBtn="Consultar por este servicio"
                                            variant="outlined"
                                            radius="8px"
                                            icon="mail"
                                            iconPosition="left"
                                            style={{ borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
                                        />
                                    </Link>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className="bg-slate-900/40 border-y border-white/5 py-16">
                <div className="max-w-4xl mx-auto px-4 text-center text-white">
                    <h2 className="text-3xl font-bold mb-6 italic">¿Tienes un requerimiento especial?</h2>
                    <p className="text-slate-400 mb-10 text-lg">
                        Si no ves exactamente lo que necesitas, contáctanos. Personalizamos nuestras soluciones para cada cliente.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6">
                        <Link href="https://wa.me/573148029030" target="_blank">
                            <Button
                                nameBtn="Chat WhatsApp"
                                variant="contained"
                                style={{ backgroundColor: '#25D366' }}
                                icon="whatsapp"
                            />
                        </Link>
                        <Link href="/contacto">
                            <Button nameBtn="Formulario de Contacto" variant="outlined" style={{ borderColor: '#3b82f6', color: '#3b82f6' }} />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
