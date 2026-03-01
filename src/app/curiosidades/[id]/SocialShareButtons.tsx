"use client";

import React from "react";
import { Svg } from "@/components";

interface Props {
    id: number;
    title: string;
}

export function SocialShareButtons({ id, title }: Props) {
    const shareOnFacebook = () => {
        const url = `https://www.impulsogp.com/curiosidades/${id}`;
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`, '_blank');
    };

    const shareOnWhatsApp = () => {
        const url = `https://www.impulsogp.com/curiosidades/${id}`;
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + url)}`, '_blank');
    };

    return (
        <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-center gap-4">
            <button
                onClick={shareOnFacebook}
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-all duration-300"
                title="Compartir en Facebook"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
            </button>
            <button
                onClick={shareOnWhatsApp}
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-all duration-300"
                title="Compartir en WhatsApp"
            >
                <Svg icon="whatsapp" fontSize="20px" />
            </button>
        </div>
    );
}
