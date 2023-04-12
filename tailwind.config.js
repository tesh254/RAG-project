/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Note the addition of the `app` directory.
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        suportal: {
          blue: "#0C8CFB",
          gray: {
            dark: "#5b5b5b",
            light: "#8e8e8e",
            100: "#e1e1e1",
          },
          purple: "#8748FF",
          black: "#181818",
        },
      },
      fontFamily: {
        suportal: {
          bold: ["GT Walsheim Pro Bold", "sans-serif"],
          medium: ["GT Walsheim Pro", "sans-serif"],
        },
      },
    },
  },
  plugins: [],
};
