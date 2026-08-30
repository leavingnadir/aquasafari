/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Brand Accent (The bright orange/coral from the logo)
        brand: {
          DEFAULT: "#F05C35",
          400: "#F27857",
          500: "#F05C35",
          600: "#D44924",
        },
        // Surface colors for backgrounds (Moody dark theme)
        surface: {
          DEFAULT: "#0A0A0A", // Deepest background (replaces sand-100/body bg)
          900: "#171717",     // Slightly lighter for cards/sections
          800: "#262626",     // Borders or lighter cards
          badge: "rgba(255, 255, 255, 0.1)", // For the semi-transparent badges
        },
        // Content colors for text
        content: {
          primary: "#FFFFFF",   // Headings & main text (replaces deep-700)
          secondary: "#D4D4D4", // Descriptions and subtitles
          muted: "#A3A3A3",     // Small text / inactive links (replaces lagoon-500 text)
        }
      },
      fontFamily: {
        body: ["'Open Sans'", "system-ui", "sans-serif"],
        display: ["'Archivo Black'", "'Open Sans'", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        hero: "url('/src/assets/images/hero.jpg')",
      },
      boxShadow: {
        // Darkened the shadow to fit a dark theme
        card: "0 10px 30px -10px rgba(0, 0, 0, 0.5)", 
      },
    },
  },
  plugins: [],
};