"use client";

import React from "react";
import { Svg } from "@/components";

const WhatsAppButton = () => {
    const phoneNumber = "573148029030"; // From the homepage CTA
    const message = "Hola, me gustaría obtener más información sobre sus servicios.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-8 right-8 z-[100] group"
            aria-label="Contactar por WhatsApp"
        >
            <div className="relative">
                {/* Ping Animation */}
                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
                
                {/* Button Body */}
                <div className="relative bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 rounded-full shadow-[0_8px_30px_rgb(37,211,102,0.4)] transition-all duration-300 transform group-hover:scale-110 group-hover:-translate-y-1 flex items-center justify-center">
                    <Svg icon="whatsapp" fontSize="32px" color="#fff" />
                    
                    {/* Tooltip */}
                    <span className="absolute right-full mr-4 bg-[#0f172a] text-white text-sm py-2 px-4 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10 shadow-xl">
                        ¿En qué podemos ayudarte?
                    </span>
                </div>
            </div>
        </a>
    );
};

export default WhatsAppButton;
