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
                    primary: "#2d4a53",
                    secondary: "#1e353b",
                },
            },
        },
    },
    plugins: [],
};
