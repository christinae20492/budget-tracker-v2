import type { Config } from "tailwindcss";

export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'selector',
  theme: {
    extend: {
      colors: {
        grey: {
          100: "#e9e9e9",
          200: "#a3a3a3",
          300: "#757575",
          400: "#141414",
          500: "#353535",
          600: "#161616"
        },

        green: {
          DEFAULT: "#86bd75",
          dark: "#1e2d3b",
          mint: "#caedd3",
          sea: "#32EE90",
          event: "#91edcb",
        },

        red: {
          DEFAULT: "#ad3d3d",
          light: "#DB6A6A",
          dark: "#21161c",
          alt: "#9D5858",
        },

        blue: {
          DEFAULT: "#52808D",
          light: "#9ED5E5",
          dark: "#243439",
          med: "#7596A5",
        },

        notindigo: {
          100:"#1C135D",
          200:"#2B1D8A",
          DEEAULT:"#3A27B7",
          300:"#8170DC",
          400:"#B2A5E9",
          500:"#E4E0F7",
        },

        pink: "#CC8A94",
        yellow: "#bdb775",
        darkyellow: "#1c1c18",
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
