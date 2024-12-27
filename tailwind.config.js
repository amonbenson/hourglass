import colors from "tailwindcss/colors";

const dark = colors.gray[900];
const darker = colors.gray[950];
const light = colors.gray[50];
const muted = colors.gray[400];

/** @type {import("tailwindcss").Config} */
export default {
  content: [
    "./src/**/*.html",
    "./src/**/*.{vue,js,jsx,ts,tsx}",
    "node_modules/flowbite/**/*.{js,jsx,ts,tsx}",
    "node_modules/flowbite-vue/**/*.{js,jsx,ts,tsx,vue}",
  ],
  darkMode: "class",
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      dark,
      darker,
      light,
      muted,
      primary: colors.teal[500],
      secondary: colors.amber[500],
      accent: colors.rose[500],
    },
    extend: {
      opacity: {
        muted: "0.5",
      },
    },
  },
  plugins: [
    import("flowbite/plugin"),
  ],
};
