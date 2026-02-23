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
      title: "Análisis de Datos",
      desc: "Convertimos datos complejos en información accionable para tu negocio.",
      icon: "chart-pie",
      color: "indigo"
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
            <div className="flex flex-col gap-8 animate-fade-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Innovación Tecnológica
              </div>

              <h1 className="text-6xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter">
                TRANSFORMAMOS <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">IDEAS EN </span> <br />
                SOLUCIONES <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-500 text-glow"></span>
              </h1>

              <p className="text-xl text-slate-400 max-w-xl leading-relaxed">
                Transformamos desafíos en experiencias.
                Soluciones.
              </p>

              <div className="flex flex-wrap gap-5 mt-4">
                <Link href="/contacto">
                  <Button
                    nameBtn="Iniciar Proyecto"
                    variant="contained"
                    radius="16px"
                    style={{ padding: '20px 40px', fontSize: '1.1rem', fontWeight: 'bold', boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)' }}
                  />
                </Link>
                <Link href="/servicios">
                  <Button
                    nameBtn="Explorar Servicios"
                    variant="outlined"
                    radius="16px"
                    style={{ padding: '20px 40px', fontSize: '1.1rem', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', backgroundColor: 'rgba(255,255,255,0.02)' }}
                  />
                </Link>
              </div>
            </div>

            <div className="relative hidden lg:block animate-fade-left">
              <div className="relative w-full aspect-square max-w-xl mx-auto">
                {/* Decorative Rings */}
                <div className="absolute inset-0 border-2 border-white/5 rounded-full scale-110 animate-pulse"></div>
                <div className="absolute inset-0 border border-blue-500/10 rounded-full scale-125"></div>

                {/* Main Visuals using existing icons */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] glass-panel rounded-3xl p-8 flex items-center justify-center transform rotate-3 hover:rotate-0 transition-transform duration-700 shadow-2xl">
                  <div className="grid grid-cols-2 gap-4 w-full h-full">
                    <div className="bg-blue-500/10 rounded-2xl p-6 flex flex-col items-center justify-center border border-white/5 group hover:border-blue-500/30 transition-colors">
                      <img src="/images/icono_tec.png" alt="Tecnología" className="w-24 h-24 object-contain group-hover:scale-110 transition-transform" />
                      <span className="text-blue-400 text-[10px] mt-4 font-bold tracking-widest uppercase">Tech Stack</span>
                    </div>
                    <div className="bg-indigo-500/10 rounded-2xl p-6 flex flex-col items-center justify-center border border-white/5 group hover:border-indigo-500/30 transition-colors">
                      <img src="/images/icono_math.png" alt="Matemáticas" className="w-24 h-24 object-contain group-hover:scale-110 transition-transform" />
                      <span className="text-indigo-400 text-[10px] mt-4 font-bold tracking-widest uppercase">Algorithms</span>
                    </div>
                    <div className="col-span-2 bg-slate-800/50 rounded-2xl p-6 flex items-center justify-between border border-white/5 group hover:border-cyan-500/30 transition-colors">
                      <div className="flex flex-col">
                        <span className="text-white font-bold">Soluciones GP</span>
                        <span className="text-slate-500 text-xs">Excellence in Engineering</span>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                        <Svg icon="ok" color="#06b6d4" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Tags */}
                <div className="absolute -top-4 right-10 px-4 py-2 bg-slate-900 border border-white/10 rounded-full text-xs text-white font-medium shadow-xl animate-bounce">
                  React / Next.js
                </div>
                <div className="absolute bottom-10 -left-4 px-4 py-2 bg-slate-900 border border-white/10 rounded-full text-xs text-white font-medium shadow-xl">
                  Advanced Math
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="py-32 bg-[#0f172a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Nuestros Pilares</h2>
            <div className="w-20 h-1.5 bg-blue-500 rounded-full mb-8"></div>
            <p className="text-slate-400 max-w-2xl text-lg">
              Enfoque integral .
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredServices.map((service, idx) => (
              <div
                key={idx}
                className="group p-8 rounded-3xl bg-slate-900/40 border border-white/5 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`w-16 h-16 rounded-2xl bg-${service.color}-500/10 flex items-center justify-center mb-8 group-hover:bg-${service.color}-500/20 transition-colors`}>
                  <Svg icon={service.icon} fontSize="32px" color={service.color === 'blue' ? '#3b82f6' : service.color === 'indigo' ? '#6366f1' : '#06b6d4'} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
                <p className="text-slate-400 mb-8 leading-relaxed">
                  {service.desc}
                </p>
                <Link href="/servicios" className="inline-flex items-center gap-2 text-blue-400 font-bold hover:text-blue-300 transition-colors group/link">
                  Ver detalles
                  <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-blue-600"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 opacity-90"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
          <div className="text-white max-w-xl">
            <h2 className="text-4xl lg:text-5xl font-black mb-6 leading-tight italic">¿Listo para escalar tu visión técnica?</h2>
            <p className="text-blue-100 text-lg opacity-80">Hablemos sobre cómo nuestras soluciones pueden transformar tu empresa hoy mismo.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="https://wa.me/573148029030" target="_blank">
              <Button
                nameBtn="Enviar WhatsApp"
                variant="contained"
                style={{ backgroundColor: '#fff', color: '#1e40af', fontWeight: 'bold', padding: '16px 32px' }}
                radius="12px"
                icon="whatsapp"
                iconPosition="left"
                iconSize="20px"
              />
            </Link>
            <Link href="/contacto">
              <Button
                nameBtn="Agendar Cita"
                variant="outlined"
                style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff', padding: '16px 32px' }}
                radius="12px"
              />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
