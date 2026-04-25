export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        neon: "0 0 28px rgba(34, 211, 238, 0.35), 0 0 46px rgba(244, 114, 182, 0.25)",
      },
    },
  },
  plugins: [],
};
