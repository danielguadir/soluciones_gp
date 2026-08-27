import { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "ImpulsoGP | Cumbal",
  description: "Desarrollo web, software a medida y soluciones digitales para negocios en Cumbal y toda Colombia.",
  alternates: {
    canonical: "https://www.impulsogp.com",
  },
};

export default function HomePage() {
  return <HomeClient />;
}
