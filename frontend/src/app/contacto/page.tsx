"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button, Card, Svg } from "@/components";

// Nota: Estos campos se basan en los que vimos en el Design System (CmpFieldText, etc.)
// pero los usaremos de forma directa para mayor control en esta página específica.
export default function ContactPage() {
    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
        asunto: "",
        mensaje: ""
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Aquí irá la lógica para conectar con el backend
        alert("¡Gracias! En breve nos pondremos en contacto contigo.");
        console.log("Form data:", formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="bg-gray-50 min-h-screen py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                    {/* Info Section */}
                    <div className="flex flex-col gap-10">
                        <div>
                            <h1 className="text-5xl font-extrabold text-gray-900 mb-6 italic">Hablemos de tu <span className="text-blue-600">Próximo Proyecto</span></h1>
                            <p className="text-xl text-gray-600 leading-relaxed">
                                Estamos listos para ayudarte a escalar tu negocio con tecnología de punta. Cuéntanos tu idea y la haremos realidad.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="flex gap-6 items-start">
                                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Svg icon="whatsapp" fontSize="24px" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-1">WhatsApp Directo</h3>
                                    <a href="https://wa.me/573148029030" target="_blank" className="text-green-600 font-medium text-lg hover:underline transition-all">
                                        +57 314 802 9030
                                    </a>
                                    <p className="text-gray-500 text-sm mt-1 text-italic">Respuesta inmediata</p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start">
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Svg icon="mail" fontSize="24px" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-1">Email</h3>
                                    <p className="text-blue-600 font-medium text-lg">contacto@serviciosgp.com</p>
                                    <p className="text-gray-500 text-sm mt-1 text-italic">Para propuestas detalladas</p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start">
                                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Svg icon="location" fontSize="24px" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-1">Ubicación</h3>
                                    <p className="text-gray-600 text-lg">Bogotá, Colombia</p>
                                    <p className="text-gray-500 text-sm mt-1 text-italic">Servicio remoto a todo el mundo</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-blue-600 rounded-3xl text-white mt-10 shadow-2xl shadow-blue-200">
                            <h4 className="text-2xl font-bold mb-4">¿Por qué elegirnos?</h4>
                            <ul className="space-y-3 opacity-90">
                                <li className="flex gap-2">✓ Arquitecturas escalables</li>
                                <li className="flex gap-2">✓ Código limpio y mantenible</li>
                                <li className="flex gap-2">✓ Acompañamiento post-lanzamiento</li>
                            </ul>
                        </div>
                    </div>

                    {/* Form Section */}
                    <Card className="p-10 bg-white shadow-2xl rounded-3xl border-none">
                        <h2 className="text-2xl font-bold mb-8 italic">Envíanos un mensaje</h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6 font-medium">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-gray-700">Nombre Completo</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="Ej. Juan Pérez"
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-gray-700">Correo Electrónico</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="juan@empresa.com"
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-gray-700">Asunto</label>
                                <input
                                    type="text"
                                    name="asunto"
                                    value={formData.asunto}
                                    onChange={handleChange}
                                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="¿En qué podemos ayudarte?"
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-gray-700">Mensaje</label>
                                <textarea
                                    name="mensaje"
                                    rows={4}
                                    value={formData.mensaje}
                                    onChange={handleChange}
                                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                                    placeholder="Describe brevemente tu proyecto o consulta..."
                                    required
                                ></textarea>
                            </div>

                            <Button
                                nameBtn="Enviar Propuesta"
                                variant="contained"
                                radius="12px"
                                style={{ height: '56px', marginTop: '12px' }}
                                type="submit"
                            />
                        </form>
                    </Card>

                </div>
            </div>
        </div>
    );
}
