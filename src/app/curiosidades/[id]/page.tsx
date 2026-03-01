import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { curiosities } from "@/data/curiosities";
import { Svg } from "@/components/UXLib/Svg/Svg";
import { SocialShareButtons } from "./SocialShareButtons";

interface Props {
    params: { id: string };
}

export async function generateStaticParams() {
    return curiosities.map((curiosity) => ({
        id: curiosity.id.toString(),
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const id = parseInt(params.id);
    const item = curiosities.find(c => c.id === id);

    if (!item) {
        return {
            title: "Curiosidad no encontrada | IMPULSOGP"
        };
    }

    const shortDescription = item.content[0].substring(0, 160) + "...";
    const absoluteImageUrl = `https://www.impulsogp.com${item.image}`;

    return {
        title: `${item.title} | IMPULSOGP`,
        description: shortDescription,
        openGraph: {
            title: `${item.title} | IMPULSOGP`,
            description: shortDescription,
            type: "article",
            url: `https://www.impulsogp.com/curiosidades/${id}`,
            images: [
                {
                    url: absoluteImageUrl,
                    width: 1200,
                    height: 630,
                    alt: item.title,
                }
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: `${item.title} | IMPULSOGP`,
            description: shortDescription,
            images: [absoluteImageUrl],
        }
    };
}

export default function CuriosityDetail({ params }: Props) {
    const id = parseInt(params.id);
    const item = curiosities.find(c => c.id === id);

    if (!item) {
        notFound();
    }

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

                        <div className="w-full relative h-[300px] sm:h-[400px] mb-10 rounded-3xl overflow-hidden border border-white/10 group-hover:border-blue-500/30 transition-colors shadow-2xl">
                            <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>

                        <div className="space-y-6">
                            {item.content.map((p, i) => (
                                <p key={i} className="text-lg text-slate-400 leading-relaxed text-justify">
                                    {p}
                                </p>
                            ))}
                        </div>

                        <SocialShareButtons id={item.id} title={item.title} />
                    </div>
                </article>
            </div>
        </div>
    );
}
