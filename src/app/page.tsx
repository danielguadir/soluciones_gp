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
              Transformamos <span className="text-blue-400">ideas</span> en <span className="text-blue-400">soluciones reales</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-lg">
              Soluciones personalizadas.
              Desarrollo web
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
              <Link href="/contacto">
                <Button
                  nameBtn="Empezar"
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
            </div>
          </div>
        </div>
      </section>




      {/* Math Classes Highlight Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900/20 to-slate-900 border border-white/10 p-12">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6">
              <span className="text-blue-400 font-bold tracking-widest uppercase text-sm">Nuevo Servicio Educativo</span>
              <h2 className="text-4xl lg:text-5xl font-bold text-white italic">Domina las Matemáticas</h2>
              <p className="text-lg text-slate-400 leading-relaxed">
                Aprendamos matematicas juntos.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="https://wa.me/573148029030" target="_blank">
                  <Button
                    nameBtn="Reservar Cupo"
                    variant="contained"
                    radius="12px"
                    style={{ padding: '14px 28px' }}
                  />
                </Link>
                <Link href="/servicios">
                  <Button
                    nameBtn="Ver Más"
                    variant="outlined"
                    radius="12px"
                    style={{ padding: '14px 28px', borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}
                  />
                </Link>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-sm flex items-center justify-center p-8 group transition-all">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-[208px] h-[208px] group-hover:scale-110 transition-transform drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]">
                    <img src="/images/icono_math.png" alt="Math" className="w-full h-full object-contain" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-900/50 border-y border-white/5 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-white">
            <h2 className="text-3xl font-bold mb-2 italic">¿Listo para dar el siguiente paso?</h2>
            <p className="text-slate-400">Contácto.</p>
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
