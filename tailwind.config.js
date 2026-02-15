/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
        "./design-system/**/*.{js,ts,jsx,tsx,mdx,scss}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    primary: "#3b82f6",
                    secondary: "#0f172a",
                },
                blue: {
                    50: "#eff6ff",
                    100: "#dbeafe",
                    200: "#bfdbfe",
                    300: "#93c5fd",
                    400: "#60a5fa",
                    500: "#3b82f6",
                    600: "#1d4ed8",
                    700: "#1e40af",
                    800: "#1e3a8a",
                    900: "#1e3a8a",
                    950: "#0f172a", /* Main Brand Navy */
                }
            },
        },
    },
    plugins: [],
};
