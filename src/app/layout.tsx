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
  title: "IMPULSOGP",
  description: "Portafolio y servicios de IMPULSOGP",
  icons: {
    icon: "/images/icono_tec.png",
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
