"use client";
import Link from "next/link";
import { Button, Card, Svg } from "@/components";

export default function HomePage() {
  const featuredServices = [
    {
      title: "Desarrollo de Software",
      desc: "Creamos aplicaciones web y móviles escalables con las últimas tecnologías.",
      icon: "cog",
      color: "blue"
    },
    {
      title: "Soluciones Matemáticas",
      desc: " Clases de Matemáticas.",
      icon: "target",
      color: "cyan"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#0f172a] bg-grid-white">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[5%] w-72 h-72 bg-blue-600/20 rounded-full blur-[120px] animate-blob"></div>
          <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
          <div className="absolute top-[40%] right-[20%] w-64 h-64 bg-cyan-600/10 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-8 animate-fade-right relative z-20">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase w-fit">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black text-white leading-[1.1] sm:leading-[0.9] tracking-tighter">
                TRANSFORMAMOS <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">IDEAS EN </span> <br className="hidden sm:block" />
                SOLUCIONES <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-500 text-glow"></span>
              </h1>

              <p className="text-xl text-slate-400 max-w-xl leading-relaxed">
                Transformamos desafíos en experiencias.
                Soluciones.
              </p>

              <p className="text-xl text-slate-400 max-w-xl leading-relaxed">
                Transformamos desafíos en experiencias.
                Soluciones.
              </p>
            </div>

            <div className="relative animate-fade-left">
              <div className="relative w-full aspect-square max-w-2xl mx-auto flex items-center justify-center">
                {/* Glow effects around the image */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-32 h-[80%] bg-blue-500/20 blur-[80px] rounded-full animate-pulse"></div>
                <div className="absolute top-1/2 right-0 -translate-y-1/2 w-32 h-[80%] bg-indigo-500/20 blur-[80px] rounded-full animate-pulse animation-delay-2000"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-cyan-500/10 blur-[60px] rounded-full"></div>

                {/* Main Hero Image */}
                <div className="relative z-10 w-full h-full p-4 group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <img
                    src="/images/hero/inicio_pw.png"
                    alt="ImpulsoGP Hero"
                    className="w-full h-full object-contain rounded-[40px] shadow-2xl transform transition-all duration-700 group-hover:scale-[1.02] group-hover:-rotate-1"
                  />

                  {/* Animated side highlights */}
                  <div className="absolute top-1/4 -left-2 w-1 h-1/2 bg-gradient-to-b from-transparent via-blue-400 to-transparent opacity-50 blur-sm"></div>
                  <div className="absolute top-1/4 -right-2 w-1 h-1/2 bg-gradient-to-b from-transparent via-indigo-400 to-transparent opacity-50 blur-sm"></div>
                </div>

                {/* Decorative floating elements */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl animate-blob"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl animate-blob animation-delay-4000"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="py-32 bg-[#0f172a] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Nuestros Pilares</h2>
            <div className="w-20 h-1.5 bg-blue-500 rounded-full mb-8"></div>
            <p className="text-slate-400 max-w-2xl text-lg">
              Enfoque integral .
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Service 1: Web Development */}
            <div className="group p-8 rounded-3xl bg-slate-900/40 border border-white/5 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-8 group-hover:bg-blue-500/20 transition-colors">
                <Svg icon="cog" fontSize="32px" color="#3b82f6" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Desarrollo Web</h3>
              <p className="text-slate-400 mb-8 leading-relaxed">
                Desarrollo de pagina web de su negocio, tienda o emprendimiento.
              </p>
              <Link href="/servicios" className="inline-flex items-center gap-2 text-blue-400 font-bold hover:text-blue-300 transition-colors group/link">
                Ver detalles
                <span className="group-hover/link:translate-x-1 transition-transform">→</span>
              </Link>
            </div>

            {/* Service 2: Math Solutions */}
            <div className="group p-8 rounded-3xl bg-slate-900/40 border border-white/5 hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-8 group-hover:bg-cyan-500/20 transition-colors">
                <Svg icon="target" fontSize="32px" color="#06b6d4" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Soluciones Matemáticas</h3>
              <p className="text-slate-400 mb-8 leading-relaxed">
                Clases de Matemáticas.
              </p>
              <Link href="/servicios" className="inline-flex items-center gap-2 text-blue-400 font-bold hover:text-blue-300 transition-colors group/link">
                Ver detalles
                <span className="group-hover/link:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
