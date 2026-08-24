export type Category = "Tecnología" | "Matemáticas" | "Agricultura" | "Todas";

export interface Curiosity {
    id: number;
    category: Category;
    title: string;
    content: string[];
    date: string;
    image: string;
}

export const curiosities: Curiosity[] = [
    {
        id: 1,
        category: "Matemáticas",
        title: "Eratóstenes y el Diámetro de la Tierra",
        date: "Siglo III a.C.",
        content: [
            "Eratóstenes de Cirene fue un matemático, astrónomo y geógrafo griego que logró una hazaña asombrosa: medir la circunferencia de la Tierra con una precisión sorprendente utilizando únicamente la sombra de un palo y la geometría básica. Su método se basó en la observación de que en el solsticio de verano, al mediodía, el Sol se encontraba directamente sobre la ciudad de Siena (hoy Asuán), donde la luz llegaba al fondo de un pozo profundo sin proyectar sombras.",
            "Al mismo tiempo, en la ciudad de Alejandría, situada al norte, los objetos sí proyectaban sombra. Eratóstenes midió el ángulo de esta sombra y determinó que era de aproximadamente 7.2 grados, lo que representaba una quincuagésima parte de un círculo completo (360 grados). Al conocer que la distancia entre Siena y Alejandría era de unos 5,000 estadios, simplemente multiplicó esa distancia por 50 para obtener la circunferencia total del planeta.",
            "Este razonamiento lógico, basado en el supuesto de que la Tierra era esférica y que los rayos del Sol eran paralelos, le permitió calcular que la circunferencia terrestre era de unos 250,000 estadios. Aunque existe un debate sobre la longitud precisa de un 'estadio' en aquella época, las estimaciones sugieren que su error fue de apenas entre un 1% y un 15% respecto al valor real de 40,075 kilómetros.",
            "El experimento de Eratóstenes es considerado uno de los hitos más importantes en la historia de la ciencia, no solo por el resultado obtenido, sino por demostrar que el ingenio humano, apoyado en el rigor matemático y la observación cuidadosa, puede desentrañar los secretos más grandes de la naturaleza incluso con los recursos más limitados."
        ],
        image: "/images/curiosidades/matematicas.png"
    },
    {
        id: 2,
        category: "Tecnología",
        title: "La Evolución de la Web",
        date: "2024",
        content: [
            "Desde la Web 1.0 estática hasta la Web 3.0 descentralizada, la tecnología ha transformado cómo interactuamos con la información. La IA ahora permite interfaces dinámicas que se adaptan en tiempo real a las necesidades del usuario."
        ],
        image: "/images/curiosidades/tecnologia.png"
    },
    {
        id: 3,
        category: "Matemáticas",
        title: "La Paradoja del Cumpleaños",
        date: "Teoría de Probabilidades",
        content: [
            "La Paradoja del Cumpleaños es uno de los fenómenos más contraintuitivos en el campo de la estadística. Establece que en un grupo de tan solo 23 personas, existe una probabilidad superior al 50% de que al menos dos de ellas compartan la misma fecha de nacimiento. Aunque a simple vista parece que se necesitarían cientos de personas para que esto ocurra, la matemática nos revela una realidad muy distinta.",
            "Este fenómeno se explica mediante la probabilidad complementaria: en lugar de calcular la probabilidad de que alguien comparta tu cumpleaños, calculamos la probabilidad de que nadie comparta fecha con nadie más. A medida que el grupo crece, el número de parejas posibles aumenta de forma exponencial (n*(n-1)/2). Para 23 personas, existen 253 combinaciones posibles de parejas, lo que eleva drásticamente las oportunidades de coincidencia.",
            "La fórmula matemática fundamental para calcular la probabilidad de que NO haya coincidencias es: P(A) = 365/365 * 364/365 * 363/365 * ... * (365-n+1)/365. Al restar este resultado de 1, obtenemos la probabilidad de éxito. Para n=23, el resultado es aproximadamente 0.5073, superando el umbral del 50%.",
            "Entender esta paradoja es vital en áreas como la criptografía y la ciberseguridad, donde se utiliza para comprender las colisiones en funciones hash. Demuestra que nuestra intuición a menudo falla cuando se enfrenta a crecimientos exponenciales y combinatorias complejas, resaltando la importancia del rigor matemático sobre las suposiciones cotidianas."
        ],
        image: "/images/curiosidades/matematicas.png"
    }
    ,
    {
        id: 4,
        category: "Agricultura",
        title: "Inteligencia Artificial y Ciencia de Datos en la Agricultura",
        date: "Actualidad",
        content: [
            "La integración de Inteligencia Artificial (IA), drones agrícolas multiespectrales y Ciencia de Datos permite monitorear cultivos en tiempo real y procesar grandes volúmenes de información geoespacial, climática y edáfica. Estos dispositivos capturan imágenes de alta precisión para detectar estrés hídrico, deficiencias nutricionales y plagas antes de que sean visibles a simple vista.",
            "Mediante modelos predictivos y analítica avanzada de Big Data, los agricultores pueden optimizar el uso del agua y fertilizantes, predecir el rendimiento de las cosechas y tomar decisiones basadas en evidencia. Esta sinergia tecnológica transforma la agricultura tradicional en agricultura de precisión, haciendo el sector más sostenible, eficiente y rentable."
        ],
        image: "/images/curiosidades/agricultura.png"
    }
];
