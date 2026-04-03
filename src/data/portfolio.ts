export interface Project {
    id: string;
    title: string;
    description: string;
    icon: string;
    link: string;
    tech: string[];
    images: string[];
}

export const projectsData: Project[] = [
    {
        id: "inventario-equipos",
        title: "Automatización de Inventario de Equipos Tecnológicos",
        description: "Sistema integral desarrollado para la gestión automatizada de activos de hardware y la optimización de la comunicación estratégica con proveedores tecnológicos.",
        icon: "database",
        link: "https://inventory-frontend-pi-two.vercel.app",
        tech: ["Next.js", "Prisma", "Automation", "Inventory SQL"],
        images: ["/images/portfolio/inventario/auth_inventario.png", "/images/portfolio/inventario/cont_inventario.png"]
    },
    {
        id: "nature-sumaq",
        title: "Nature Sumaq: E-commerce de Belleza Natural",
        description: "Plataforma de comercio electrónico dedicada a productos de cuidado personal y belleza natural, con un diseño fresco y enfocado en la experiencia del usuario.",
        icon: "cart",
        link: "https://naturesumaq11.vercel.app/",
        tech: ["Next.js", "Tailwind CSS", "E-commerce"],
        images: ["/images/portfolio/nature-sumaq/tienda1.jpg", "/images/portfolio/nature-sumaq/tienda11.png", "/images/portfolio/nature-sumaq/tienda111.jpg"]
    },
    {
        id: "agrodistrib",
        title: "AgroDistrib: Distribuidora Agropecuaria",
        description: "Solución digital para la gestión y venta de productos del sector agropecuario, facilitando la conexión entre proveedores y el campo.",
        icon: "chart-pie",
        link: "#",
        tech: ["Next.js", "Business Suite", "Agriculture Tech"],
        images: ["/images/portfolio/agrodistrib/tienda-agro.png"]
    }
];
