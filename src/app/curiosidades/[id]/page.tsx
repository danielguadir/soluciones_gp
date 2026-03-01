import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { curiosities } from "@/data/curiosities";
import { Svg } from "@/components";

interface Props {
    params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const id = parseInt(params.id);
    const item = curiosities.find(c => c.id === id);

    if (!item) {
        return {
            title: "Curiosidad no encontrada | IMPULSOGP"
        };
    }

    return {
        title: `${item.title} | IMPULSOGP`,
        description: item.content[0].substring(0, 160) + "...",
        openGraph: {
            title: `${item.title} | IMPULSOGP`,
            description: item.content[0].substring(0, 160) + "...",
            type: "article",
            url: `https://www.impulsogp.com/curiosidades/${id}`,
        }
    };
}

export default function CuriosityDetail({ params }: Props) {
    const id = parseInt(params.id);
    const item = curiosities.find(c => c.id === id);

    if (!item) {
        notFound();
    }

    const shareOnFacebook = () => {
        const url = `https://www.impulsogp.com/curiosidades/${item.id}`;
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(item.title)}`, '_blank');
    };

    const shareOnWhatsApp = () => {
        const url = `https://www.impulsogp.com/curiosidades/${item.id}`;
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(item.title + " " + url)}`, '_blank');
    };

    return (
        <div className="bg-[#0f172a] min-h-screen text-slate-300 pb-20 pt-32">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link
                    href="/curiosidades"
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
                >
                    <Svg icon="left-open" fontSize="16px" />
                    <span>Volver a Curiosidades</span>
                </Link>

                <article className="p-10 bg-white/5 backdrop-blur-md rounded-[40px] border border-white/10 relative overflow-hidden group">
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
                        <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-8 italic text-left leading-tight">
                            {item.title}
                        </h1>

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
                    </div>
                </article>
            </div>
        </div>
    );
}
