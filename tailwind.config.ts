import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "selector",
  theme: {
    extend: {
      colors: {
        grey: {
          50: "#f5f5f5",
          150: "#cccccc",
          700: "#0a0a0a",
          100: "#e9e9e9",
          200: "#a3a3a3",
          300: "#757575",
          400: "#141414",
          500: "#353535",
          600: "#161616",
        },

        green: {
          light: "#b2ddb0",
          deep: "#2b4732",
          vivid: "#6ACF6A",
          DEFAULT: "#86bd75",
          dark: "#1e2d3b",
          mint: "#caedd3",
          sea: "#32EE90",
          event: "#91edcb",
        },

        red: {
          soft: "#E8A1A1",
          deep: "#4D1F1F",
          crimson: "#B22222",
          DEFAULT: "#ad3d3d",
          light: "#DB6A6A",
          dark: "#21161c",
          alt: "#9D5858",
        },

        blue: {
          pale: "#c5e5f1",
          cobalt: "#0047AB",
          dusk: "#355B6C",
          DEFAULT: "#52808D",
          light: "#9ED5E5",
          dark: "#243439",
          med: "#7596A5",
        },

        notindigo: {
          50: "#0F0A3C",
          75: "#150F49",
          250: "#3421A0",
          100: "#1C135D",
          200: "#2B1D8A",
          DEEAULT: "#3A27B7",
          300: "#8170DC",
          400: "#B2A5E9",
          500: "#E4E0F7",
        },

        pink: {
          light: "#E3AAB3",
          dark: "#914F5B",
          blush: "#F7C1C8",
        },

        yellow: {
          pale: "#e6e3b5",
          gold: "#AFA72B",
          bronze: "#8a8644",
        },

        darkyellow: {
          olive: "#3a3a1e",
          khaki: "#5f5f33",
          soot: "#0a0a07",
        },

        greengrey: {
          DEFAULT: "1F251F",
          200: "2D332D",
          400: "3B413B",
          600: "151B15",
          800: "101610"
        },

        mintgrey: {
          100: '#5A615C',
          300: '#4B514D',
          500: '#3C413E', 
          600: '#2D312F', 
          700: '#1E2120',
          900: '#0F100F',
        },
      },
      fontFamily: {
        sans: [
          '"Inter"',
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
        header: ["AgenorNeue-Regular", "sans-serif"],
        body: ["Identidad-ExtraBold", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
