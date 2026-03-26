/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#080808",
        panel: "#101010",
        muted: "#181818",
        line: "#232323",
        text: "#f3f3f3",
        subtle: "#9a9a9a",
        accent: "#27b0ff",
        accentSoft: "#103548",
        success: "#2bd576"
      },
      boxShadow: {
        panel: "0 18px 60px rgba(0, 0, 0, 0.35)"
      },
      backgroundImage: {
        grain:
          "radial-gradient(circle at top, rgba(39,176,255,0.12), transparent 30%), radial-gradient(circle at bottom right, rgba(255,215,0,0.08), transparent 18%)"
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
