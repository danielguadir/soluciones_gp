"use client";
import Image from "next/image";
import Link from "next/link";
import { Svg } from "@/components";
import { servicesData } from "@/common/services";
import { usePageTracking } from "@/lib/hooks/usePageTracking";

export default function HomeClient() {
  usePageTracking();
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] lg:min-h-[90vh] flex items-center overflow-hidden bg-[#0f172a] bg-grid-white py-16 lg:py-0">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[5%] w-72 h-72 bg-blue-600/20 rounded-full blur-[120px] animate-blob"></div>
          <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
          <div className="absolute top-[40%] right-[20%] w-64 h-64 bg-cyan-600/10 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="flex flex-col gap-6 lg:gap-8 animate-fade-right relative z-20">
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
            </div>

            <div className="relative animate-fade-left mt-6 lg:mt-0">
              <div className="relative w-full aspect-[4/3] sm:aspect-video lg:aspect-square max-w-2xl mx-auto flex items-center justify-center">
                {/* Glow effects around the image */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-32 h-[80%] bg-blue-500/30 blur-[100px] rounded-full animate-pulse"></div>
                <div className="absolute top-1/2 right-0 -translate-y-1/2 w-32 h-[80%] bg-indigo-500/30 blur-[100px] rounded-full animate-pulse animation-delay-2000"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-cyan-500/15 blur-[80px] rounded-full"></div>

                {/* Main Hero Image */}
                <div className="relative z-10 w-full h-full p-2 sm:p-4 group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/15 to-transparent rounded-[30px] sm:rounded-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <Image
                    src="/images/hero/inicio1_pw.png"
                    alt="ImpulsoGP Hero"
                    fill
                    priority
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 60vw"
                    className="object-contain sm:object-cover lg:object-contain rounded-[30px] sm:rounded-[40px] shadow-2xl transform transition-all duration-1000 group-hover:scale-[1.03] group-hover:-rotate-1"
                  />

                  {/* Animated side highlights */}
                  <div className="absolute top-1/4 -left-2 w-1.5 h-1/2 bg-gradient-to-b from-transparent via-blue-400 to-transparent opacity-60 blur-md"></div>
                  <div className="absolute top-1/4 -right-2 w-1.5 h-1/2 bg-gradient-to-b from-transparent via-indigo-400 to-transparent opacity-60 blur-md"></div>
                </div>

                {/* Decorative floating elements */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl animate-blob"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl animate-blob animation-delay-4000"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="py-32 bg-[#0f172a] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Creative Section Separator */}
          <div className="relative flex items-center justify-center mb-16 sm:mb-20">
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"></div>
            <div className="absolute px-6 bg-[#0f172a] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_#3b82f6]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 opacity-80"></span>
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse delay-300 shadow-[0_0_10px_#6366f1]"></span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {servicesData.map((service, index) => (
              <div key={index} className="group p-8 rounded-3xl bg-slate-900/40 border border-white/5 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between">
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-8 group-hover:bg-blue-500/20 transition-colors">
                    <Svg icon={service.icon} fontSize="32px" color={`${service.color === 'blue' ? '#3b82f6' : service.color === 'cyan' ? '#06b6d4' : '#6366f1'}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
                  {service.description ? (
                    <p className="text-slate-400 mb-6 leading-relaxed">
                      {service.description}
                    </p>
                  ) : null}
                  {service.features && service.features.length > 0 && (
                    <div className="grid grid-cols-1 gap-2.5 mb-8">
                      {service.features.map((feature, fIndex) => (
                        <div key={fIndex} className="flex items-center gap-2 text-sm text-slate-300 font-medium">
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            service.color === 'blue' ? 'bg-blue-400' : 
                            service.color === 'cyan' ? 'bg-cyan-400' : 
                            'bg-indigo-400'
                          }`}></span>
                          {feature}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Link href="/servicios" className="inline-flex items-center gap-2 text-blue-400 font-bold hover:text-blue-300 transition-colors group/link mt-4">
                  Ver detalles
                  <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
