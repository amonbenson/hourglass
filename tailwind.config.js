import colors from "tailwindcss/colors";

/** @type {import("tailwindcss").Config} */
export default {
  content: ["./src/**/*.html", "./src/**/*.{vue,js,jsx,ts,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      bg: colors.gray[900],
      bgDark: colors.gray[950],
      bgLight: colors.gray[800],
      fg: colors.gray[50],
      fgDark: colors.gray[100],
      primary: colors.teal[500],
      primaryDark: colors.teal[700],
      secondary: colors.rose[500],
      secondaryDark: colors.rose[700],
    },
    extend: {
      opacity: {
        muted: "0.5",
      },
    },
  },
  plugins: [],
};
