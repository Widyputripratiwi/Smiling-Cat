/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#f48c25",
                "primary-hover": "#d97718", // From Add Pet designs
                "background-light": "#f8f7f5", // Unified Light Background
                "background-dark": "#221910", // Consolidated Dark Background
                "surface-light": "#ffffff",
                "surface-dark": "#2c2219", // Dark Card bg
                "text-main": "#1c140d",
                "text-muted": "#9c7349",
                "text-secondary": "#9c7349", // Alias for muted
                "border-light": "#e8dbce",
                "border-dark": "#443b32",
                "chip-bg": "#F6F4F2", // For chips in Add Pet
            },
            fontFamily: {
                "display": ["Plus Jakarta Sans", "Manrope", "sans-serif"],
                "body": ["Noto Sans", "Manrope", "sans-serif"],
            },
            borderRadius: {
                "DEFAULT": "0.5rem",
                "lg": "1rem",
                "xl": "1.5rem",
                "2xl": "2rem",
                "3xl": "2.5rem", // For some cards
                "full": "9999px"
            },
            boxShadow: {
                "soft": "0 4px 20px -2px rgba(28, 20, 13, 0.05), 0 2px 8px -2px rgba(28, 20, 13, 0.02)",
                "emboss": "0 1px 2px 0 rgba(28, 20, 13, 0.05)",
                "card": "0 2px 12px rgba(0,0,0,0.04)",
                "card-hover": "0 12px 24px rgba(0,0,0,0.08)",
            }
        },
    },
    plugins: [],
}
