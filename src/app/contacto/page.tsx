"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button, Card, Svg } from "@/components";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
        asunto: "",
        mensaje: ""
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("¡Gracias! En breve nos pondremos en contacto contigo.");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="bg-[#0f172a] min-h-screen py-20 text-slate-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                    {/* Info Section */}
                    <div className="flex flex-col gap-10">
                        <div>
                            <h1 className="text-5xl font-extrabold text-white mb-6 italic">Hablemos</h1>
                        </div>

                        <div className="space-y-8">
                            <div className="flex gap-6 items-start group">
                                <div className="w-12 h-12 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center flex-shrink-0 border border-green-500/20 group-hover:scale-110 transition-transform">
                                    <Svg icon="whatsapp" fontSize="24px" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-1 text-white">WhatsApp Directo</h3>
                                    <a href="https://wa.me/573148029030" target="_blank" className="text-green-400 font-medium text-lg hover:underline transition-all">
                                        +57 314 802 9030
                                    </a>
                                    <p className="text-slate-500 text-sm mt-1 italic">Respuesta inmediata</p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start group">
                                <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center flex-shrink-0 border border-blue-500/20 group-hover:scale-110 transition-transform">
                                    <Svg icon="mail" fontSize="24px" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-1 text-white">Email</h3>
                                    <p className="text-blue-400 font-medium text-lg">contacto@serviciosgp.com</p>
                                    <p className="text-slate-500 text-sm mt-1 italic">Para propuestas detalladas</p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start group">
                                <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center flex-shrink-0 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                                    <Svg icon="location" fontSize="24px" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-1 text-white">Ubicación</h3>
                                    <p className="text-slate-400 text-lg">Bogotá, Colombia</p>
                                    <p className="text-slate-500 text-sm mt-1 italic">Servicio remoto a todo el mundo</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-blue-600/10 border border-blue-500/20 rounded-3xl text-white mt-10 shadow-2xl backdrop-blur-sm">
                            <h4 className="text-2xl font-bold mb-4 text-blue-400">¿Por qué elegirnos?</h4>
                            <ul className="space-y-3 text-slate-300">
                                <li className="flex gap-2">✓ Arquitecturas escalables de alto nivel</li>
                                <li className="flex gap-2">✓ Código limpio y mantenibilidad total</li>
                                <li className="flex gap-2">✓ Acompañamiento estratégico constante</li>
                            </ul>
                        </div>
                    </div>

                    {/* Form Section */}
                    <Card className="p-10 bg-white/5 backdrop-blur-md shadow-2xl rounded-3xl border border-white/10">
                        <h2 className="text-2xl font-bold mb-8 italic text-white">Envíanos un mensaje</h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6 font-medium">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-slate-400">Nombre Completo</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    className="w-full p-4 bg-slate-900/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white placeholder:text-slate-600"
                                    placeholder="Ej. Juan Pérez"
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-slate-400">Correo Electrónico</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full p-4 bg-slate-900/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white placeholder:text-slate-600"
                                    placeholder="juan@empresa.com"
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-slate-400">Asunto</label>
                                <input
                                    type="text"
                                    name="asunto"
                                    value={formData.asunto}
                                    onChange={handleChange}
                                    className="w-full p-4 bg-slate-900/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white placeholder:text-slate-600"
                                    placeholder="¿En qué podemos ayudarte?"
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-slate-400">Mensaje</label>
                                <textarea
                                    name="mensaje"
                                    rows={4}
                                    value={formData.mensaje}
                                    onChange={handleChange}
                                    className="w-full p-4 bg-slate-900/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none text-white placeholder:text-slate-600"
                                    placeholder="Describe brevemente tu proyecto o consulta..."
                                    required
                                ></textarea>
                            </div>

                            <Button
                                nameBtn="Enviar Propuesta"
                                variant="contained"
                                radius="12px"
                                style={{ height: '56px', marginTop: '12px', fontWeight: 'bold' }}
                                type="submit"
                            />
                        </form>
                    </Card>

                </div>
            </div>
        </div>
    );
}
