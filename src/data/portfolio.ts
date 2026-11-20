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
        id: "casa-memoria-cumbal",
        title: "La Casa de la Memoria del Gran Cumbal",
        description: "En desarrollo",
        icon: "landmark",
        link: "#",
        tech: ["Next.js", "TypeScript", "Patrimonio Cultural", "Cumbal Nariño"],
        images: [
            "/images/portfolio/casa-memoria/casa_memoria_1.png",
            "/images/portfolio/casa-memoria/casa_memoria_2.png"
        ]
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
        id: "lovable-booking-beauty",
        title: "Lovable: Elegant Booking Beauty",
        description: "Prototipo Lovable para reserva de servicios de belleza, implementado con Next.js, TypeScript y Tailwind CSS. Desplegado en Vercel con arquitectura mantenible y componentes reutilizables.",
        icon: "heart",
        link: "https://elegant-booking-beauty.lovable.app",
        tech: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
        images: [
            "/images/portfolio/pwkaren/lovable.png"
        ]
    },
    {
        id: "simulacion-fendt-728",
        title: "Simulación 3D: Tractor Fendt 728",
        description: "Simulación interactiva en 3D del tractor agrícola Fendt 728, diseñada con gráficos web avanzados para visualización técnica, exploración de componentes y experiencia inmersiva en tiempo real.",
        icon: "cog",
        link: "https://simulacion-fend728.vercel.app/",
        tech: ["3D Simulation", "WebGL / Three.js", "Next.js", "Vercel"],
        images: [
            "/images/portfolio/simulacion-fendt/fendttr_3d.png"
        ]
    },
    {
        id: "pwa-parqueadero",
        title: "PWA: Sistema Inteligente de Gestión de Parqueadero",
        description: "Aplicación Web Progresiva (PWA) diseñada para el control eficiente de ingresos y salidas vehiculares, cálculo automatizado de tarifas, monitoreo de cupos en tiempo real y operación fluida desde dispositivos móviles y escritorio.",
        icon: "dashboard",
        link: "https://pwa-parqueadero.vercel.app/",
        tech: ["PWA", "Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
        images: [
            "/images/portfolio/pwa-parqueadero/parqueadero_pwa.png",
            "/images/portfolio/pwa-parqueadero/pwa_imagen2.jpg"
        ]
    }
];
