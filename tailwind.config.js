/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        accent: "#34a3b9",
        "accent-light": "#e4faff",
        "accent-hover": "#34a3b99f",
        secondary: "#2ecc71",
        "secondary-light": "#dcffeb",
        "secondary-hover": "#a1ffc8",
        tertiary: "#1a68ce",
        "tertiary-light": "#aacfff",
        "tertiary-hover": "#7db5ff",
        "font-color": "#343841",
        error: "#cf2335",
        "table-layout-color": "#343841",
      },
      fontFamily: {
        poppins: ["Poppins"],
      },
      container: {
        center: true,
      },
      maxWidth: {
        page: "1350px",
      },
      screens: {
        xs: "400px",
        sm: "640px",
        md: "900px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
  },
};
