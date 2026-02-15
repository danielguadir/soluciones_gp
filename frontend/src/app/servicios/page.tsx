"use client";

import React from "react";
import Link from "next/link";
import { Button, Card, Svg } from "@/components";

const servicesList = [
    {
        title: "Desarrollo Web Fullstack",
        icon: "code",
        description: "Creación de aplicaciones web modernas, rápidas y seguras. Utilizamos React, Next.js y Node.js para entregar soluciones de alta calidad.",
        features: ["Arquitectura escalable", "Optimización SEO", "Diseño Responsivo", "Integración de APIs"]
    },
    {
        title: "Arquitectura de Software",
        icon: "laptop",
        description: "Diseño de infraestructuras robustas y escalables para proyectos de gran envergadura. Aseguramos mantenibilidad y rendimiento.",
        features: ["Microservicios", "Diseño de Bases de Datos", "Cloud Computing", "Seguridad"]
    },
    {
        title: "Consultoría Técnica",
        icon: "info-circled",
        description: "Asesoramiento especializado para la toma de decisiones tecnológicas estratégicas. Aumentamos la eficiencia de tu equipo.",
        features: ["Elección de Stack", "Auditoría de Código", "Mejora de Procesos", "Mentoria"]
    },
    {
        title: "Integración de Sistemas",
        icon: "database",
        description: "Integramos diferentes plataformas y servicios para que tus datos fluyan de manera eficiente entre todas tus herramientas.",
        features: ["Webhooks", "ETL", "Pagos Online", "CRMs"]
    }
];

export default function ServicesPage() {
    return (
        <div className="bg-white min-h-screen">
            {/* Header */}
            <section className="bg-gray-50 py-20 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6">
                        Servicios Profesionales de <span className="text-blue-600">Ingeniería</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto italic">
                        Ofrecemos soluciones integrales con un enfoque en la calidad, la escalabilidad y el éxito a largo plazo de tu negocio.
                    </p>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {servicesList.map((service, index) => (
                            <Card key={index} className="p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 rounded-2xl group">
                                <div className="flex flex-col gap-6">
                                    <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                                        <Svg icon={service.icon} fontSize="28px" />
                                    </div>

                                    <div>
                                        <h2 className="text-2xl font-bold mb-4 text-gray-900">{service.title}</h2>
                                        <p className="text-gray-600 leading-relaxed mb-6">
                                            {service.description}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mb-6">
                                        {service.features.map((feature, fIndex) => (
                                            <div key={fIndex} className="flex items-center gap-2 text-sm text-gray-500">
                                                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
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
                                        />
                                    </Link>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className="bg-gray-900 py-16">
                <div className="max-w-4xl mx-auto px-4 text-center text-white">
                    <h2 className="text-3xl font-bold mb-6 italic">¿Tienes un requerimiento especial?</h2>
                    <p className="text-gray-400 mb-10 text-lg">
                        Si no ves exactamente lo que necesitas, contáctanos. Personalizamos nuestras soluciones para cada cliente.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6">
                        <Link href="https://wa.me/573148029030" target="_blank">
                            <Button
                                nameBtn="Chat WhatsApp"
                                variant="contained"
                                style={{ backgroundColor: '#25D366' }}
                            />
                        </Link>
                        <Link href="/contacto">
                            <Button nameBtn="Formulario de Contacto" variant="outlined" style={{ borderColor: '#fff', color: '#fff' }} />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
