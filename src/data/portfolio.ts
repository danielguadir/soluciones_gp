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
    },
    {
        id: "mundial-jheison-fs",
        title: "Mundial Jheison FS: Campeonato Regional",
        description: "Plataforma dinámica para la gestión de torneos de fútbol en San Adolfo Huila. Incluye inscripción en línea, tabla de posiciones dinámica y visualizaciones compartibles en redes sociales.",
        icon: "chart-line",
        link: "https://wa.me/573148029030?text=Hola,%20quisiera%20solicitar%20un%20demo%20del%20sistema%20para%20campeonatos%20de%20fútbol.",
        tech: ["Next.js", "Tournament Manager", "Dynamic SEO"],
        images: ["/images/portfolio/cancha_js/cancha.png", "/images/portfolio/cancha_js/cancha2.png"]
    },
    {
        id: "page-web-karen",
        title: "Page Web Karen: Servicios de Peluquería y Belleza",
        description: "Prototipo de landing page para servicios de peluquería y belleza, desarrollado con Next.js, TypeScript y Tailwind CSS. Página desplegada en Vercel y construida con componentes escalables y reutilizables.",
        icon: "heart",
        link: "https://page-web-karen.vercel.app",
        tech: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
        images: [
            "https://via.placeholder.com/1200x675.png?text=Page+Web+Karen+%2F+Peluquer%C3%ADa+%26+Belleza",
            "https://via.placeholder.com/1200x675.png?text=Prototipo+Lovable+%2F+Dise%C3%B1o+Web"
        ]
    },
    {
        id: "elegant-booking-beauty",
        title: "Elegant Booking Beauty: Reserva de Belleza",
        description: "Sitio de reserva para servicios de belleza creado con Next.js y desplegado para producción. Diseño mantenible, con enfoque en experiencia de usuario y arquitectura modular para futuras iteraciones.",
        icon: "star-1",
        link: "https://elegant-booking-beauty.lovable.app",
        tech: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
        images: [
            "https://via.placeholder.com/1200x675.png?text=Elegant+Booking+Beauty",
            "https://via.placeholder.com/1200x675.png?text=Reserva+de+Servicios+de+Belleza"
        ]
    }
];
