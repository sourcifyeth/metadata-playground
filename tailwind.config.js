module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        ceruleanBlue: {
          10: "#EAEEF7",
          40: "#AAB9DD",
          70: "#6B85C4",
          100: "#2B50AA",
          130: "#1E3877",
          160: "#112044",
          190: "#040811",
        },
      },
    },
  },
  variants: {
    extend: {
      opacity: ["disabled"],
      cursor: ["disabled"],
      textColor: ["disabled"],
    },
  },
  plugins: [],
};
