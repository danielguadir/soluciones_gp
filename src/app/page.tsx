"use client";
import Link from "next/link";
import { Button, Card, Svg } from "@/components";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden bg-[#0f172a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6 animate-fade-right">
            <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-tight">
              Transformamos <span className="text-blue-400">Ideas</span> en Software de <span className="text-blue-400">Alto Impacto</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-lg">
              Soluciones tecnológicas personalizadas para empresas y emprendedores. Especialistas en desarrollo web, arquitectura de sistemas y consultoría técnica.
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
              <Link href="/contacto">
                <Button
                  nameBtn="Empezar Proyecto"
                  variant="contained"
                  radius="12px"
                  style={{ padding: '16px 32px' }}
                />
              </Link>
              <Link href="/servicios">
                <Button
                  nameBtn="Ver Servicios"
                  variant="outlined"
                  radius="12px"
                  style={{ padding: '16px 32px', borderColor: '#3b82f6', color: '#3b82f6' }}
                />
              </Link>
            </div>
          </div>

          <div className="hidden lg:flex justify-center animate-fade-left">
            <div className="relative w-full max-w-md">
              <div className="absolute -top-4 -left-4 w-72 h-72 bg-blue-500/10 rounded-full mix-blend-screen filter blur-3xl opacity-70 animate-blob"></div>
              <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-indigo-500/10 rounded-full mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
              <Card className="relative bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl p-8 rounded-2xl">
                <div className="flex flex-col gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                    <Svg icon="code" fontSize="24px" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Desarrollo a Medida</h3>
                  <p className="text-slate-400 text-sm">Creamos aplicaciones escalables utilizando las últimas tecnologías del mercado.</p>
                  <div className="h-1 w-20 bg-blue-600 rounded-full"></div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-16 flex flex-col gap-4">
          <h2 className="text-4xl font-bold text-white italic">Especialidades</h2>
          <p className="text-slate-400 max-w-2xl mx-auto italic">
            Nuestros servicios están diseñados para escalar junto con tu negocio, asegurando mantenibilidad y rendimiento a largo plazo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Desarrollo Web", icon: "laptop", desc: "Sitios rápidos, responsivos y optimizados para SEO con Next.js." },
            { title: "Apps de Negocio", icon: "database", desc: "Sistemas de gestión interna y dashboards personalizados." },
            { title: "Consultoría", icon: "info-circled", desc: "Asesoría técnica para optimizar procesos y elegir tecnología." },
          ].map((service, i) => (
            <Card key={i} className="hover:shadow-lg transition-all border border-white/5 bg-white/5 backdrop-blur-sm p-6 rounded-xl hover:border-blue-500/30">
              <div className="flex flex-col gap-4">
                <div className="w-10 h-10 bg-blue-950 text-blue-400 rounded-lg flex items-center justify-center">
                  <Svg icon={service.icon} fontSize="20px" />
                </div>
                <h3 className="text-lg font-bold text-white">{service.title}</h3>
                <p className="text-sm text-slate-400">{service.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-900/50 border-y border-white/5 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-white">
            <h2 className="text-3xl font-bold mb-2 italic">¿Listo para dar el siguiente paso?</h2>
            <p className="text-slate-400">Contáctanos hoy mismo y hablemos sobre tu proyecto.</p>
          </div>
          <Link href="https://wa.me/573148029030" target="_blank">
            <Button
              nameBtn="Chat por WhatsApp"
              variant="contained"
              style={{ backgroundColor: '#25D366', color: '#fff', fontWeight: 'bold' }}
              radius="12px"
              icon="whatsapp"
            />
          </Link>
        </div>
      </section>
    </div>
  );
}
