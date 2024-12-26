import colors from "tailwindcss/colors";

/** @type {import("tailwindcss").Config} */
export default {
  content: [
    "./src/**/*.html",
    "./src/**/*.{vue,js,jsx,ts,tsx}",
    "node_modules/flowbite/**/*.{js,jsx,ts,tsx}",
    "node_modules/flowbite-vue/**/*.{js,jsx,ts,tsx,vue}",
  ],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      dark: colors.gray[900],
      darker: colors.gray[950],
      light: colors.gray[50],
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
