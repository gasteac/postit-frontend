/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ]],
  theme: {
    extend: {
      screens: {
        lowEndPhone: "302px",
        // => @media (min-width: 302px) { ... }
      },
    },
  },
  plugins: [
    require('daisyui')
  ],
  daisyui: {
    themes: [
      {
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          fontFamily: "Roboto",
        },
      },
    ],
  },
};

