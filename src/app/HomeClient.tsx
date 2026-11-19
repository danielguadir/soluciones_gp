"use client";
import Link from "next/link";
import { CreativeSeparator, Svg } from "@/components";
import { servicesData } from "@/common/services";
import { usePageTracking } from "@/lib/hooks/usePageTracking";
import { InteractiveHero } from "@/components/hero/InteractiveHero";

export default function HomeClient() {
  usePageTracking();
  return (
    <div className="flex flex-col min-h-screen">
      {/* Interactive Mathematical Hero Section */}
      <InteractiveHero />

      {/* Featured Services Section */}
      <section className="py-32 bg-[#0f172a] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Creative Section Separator */}
          <CreativeSeparator className="mb-16 sm:mb-20" />

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
