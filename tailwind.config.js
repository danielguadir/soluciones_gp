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
                    primary: "#0f172a",
                    secondary: "#1e293b",
                },
                blue: {
                    50: "#f8fafc",
                    100: "#f1f5f9",
                    200: "#e2e8f0",
                    300: "#cbd5e1",
                    400: "#94a3b8",
                    500: "#64748b",
                    600: "#0f172a", /* Main Brand Color */
                    700: "#020617",
                    800: "#01040a",
                    900: "#000000",
                }
            },
        },
    },
    plugins: [],
};
