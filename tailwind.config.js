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
      dark: "rgb(var(--color-dark))",
      darker: "rgb(var(--color-darker))",
      light: "rgb(var(--color-light))",
      muted: "rgb(var(--color-muted))",
      primary: "rgb(var(--color-primary))",
      secondary: "rgb(var(--color-secondary))",
      accent: "rgb(var(--color-accent))",
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
