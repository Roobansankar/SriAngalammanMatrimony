// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   darkMode: "class",
//   content: ["./src/**/*.{js,jsx,ts,tsx}"],
//   theme: {
//     extend: {
//       colors: {
//         primary: "#c41c5d",
//         "background-light": "#f8f6f7",
//         "background-dark": "#211117",
//       },
//       fontFamily: {
//         display: ["Be Vietnam Pro", "sans-serif"],
//       },
//       borderRadius: {
//         DEFAULT: "0.5rem",
//         lg: "1rem",
//         xl: "1.5rem",
//         full: "9999px",
//       },
//     },
//   },
//   plugins: [],
// };

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#c41c5d",
        "background-light": "#f8f6f7",
        "background-dark": "#211117",

        "card-light": "#ffffff",
        "card-dark": "#2a161a",
        "text-light-primary": "#181113",
        "text-dark-primary": "#f8f6f6",
        "text-light-secondary": "#88636c",
        "text-dark-secondary": "#b1989e",
        "border-light": "#f4f0f1",
        "border-dark": "#402b30",
      },
      fontFamily: {
        heading: ["Playfair Display", "serif"],
        display: ["Poppins", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "1rem",
        xl: "1.5rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
};
