import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@/design-system/components/UXLib/styles/cmpStyles.scss";

import Navbar from "@/layout/Navbar";
import Footer from "@/layout/Footer";
import WhatsAppButton from "@/layout/WhatsAppButton";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.impulsogp.com"),
  title: {
    default: "IMPULSOGP - Soluciones Digitales y Portafolio",
    template: "%s | IMPULSOGP",
  },
  description: "Desarrollo de software a medida, e-commerce, sitios web y automatización de procesos para tu negocio con IMPULSOGP.",
  keywords: ["desarrollo web", "software a medida", "e-commerce", "automatización", "soluciones digitales", "IMPULSOGP", "programación", "Next.js"],
  authors: [{ name: "IMPULSOGP" }],
  creator: "IMPULSOGP",
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://www.impulsogp.com",
    siteName: "IMPULSOGP",
    title: "IMPULSOGP - Soluciones Digitales Profesionales",
    description: "Transformamos tu negocio con tecnología de vanguardia y software escalable.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "IMPULSOGP - Soluciones Digitales",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IMPULSOGP - Desarrollo Digital",
    description: "Estrategia digital y desarrollo de software escalable.",
    images: ["/images/og-image.png"],
  },
  icons: {
    icon: "/images/icono_tec.png",
    shortcut: "/images/icono_tec.png",
    apple: "/images/icono_tec.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
