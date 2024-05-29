/** @type {import('tailwindcss').Config} */
const flowbite = require("flowbite-react/tailwind");
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", flowbite.content()],
  theme: {
    extend: {
      screens: {
        lowEndPhone: "302px",
        // => @media (min-width: 302px) { ... }
      },
    },
  },
  plugins: [
    flowbite.plugin()
  ],
};

