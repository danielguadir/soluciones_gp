import { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "IMPULSOGP - Transformamos Ideas en Soluciones Digitales",
  description: "Estrategia digital, desarrollo de software a medida y soluciones tecnológicas escalables para transformar tu negocio.",
  alternates: {
    canonical: "https://www.impulsogp.com",
  },
};

export default function HomePage() {
  return <HomeClient />;
}
