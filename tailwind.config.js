/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Couleurs premium pour l'univers du rhum
                'rhum-green': '#1A3025', // Vert profond du logo
                'rhum-gold': '#C5A059',  // Or/Cuivre pour les boutons
                'rhum-cream': '#FDFCF8', // Fond doux pour remplacer le blanc clinique actuel
            },
            fontFamily: {
                serif: ['"Playfair Display"', 'serif'],
                sans: ['Montserrat', 'sans-serif'],
            },
        },
    },
    plugins: [],
}