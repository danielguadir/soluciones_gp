export interface Service {
    title: string;
    description: string;
    icon: string;
    color?: string;
    features?: string[];
    link?: string;
}

export const servicesData: Service[] = [
    {
        title: "Desarrollo Web",
        description: "Desarrollo de página web de su negocio, tienda o emprendimiento, con un enfoque en diseño moderno y funcional.",
        icon: "cog",
        color: "blue",
        features: ["Landing Pages", "E-commerce", "Sistemas Web"]
    },
    {
        title: "Soluciones Matemáticas",
        description: "",
        icon: "target",
        color: "cyan",
        features: ["Refuerzo Académico", "Clases Personalizadas", "Apoyo en Tareas"]
    },
    {
        title: "Automatización y gestión de información",
        description: "Herramientas para centralizar datos, agilizar consultas y facilitar la toma de decisiones con información precisa.",
        icon: "database",
        color: "indigo",
        features: ["Centralización de Datos", "Agilización de Consultas", "Dashboards Interactivos"]
    }
];
