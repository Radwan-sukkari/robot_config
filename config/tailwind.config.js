/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // ربط الأسماء بمتغيرات الـ CSS اللي عرفناها فوق
        primary: "var(--color-primary)",
        "primary-dark": "var(--color-primaryDark)",
        "primary-light": "var(--color-primaryLight)",
        background: "var(--color-background)",
        "background-light": "var(--color-backgroundLight)",
        surface: "var(--color-surface)",
      },
      fontFamily: {
        sans: ["var(--font-family)"],
      },
    },
  },
  plugins: [require("daisyui")],

  daisyui: {
    // بما أن التصميم الجديد خلفيته بيضاء، نستخدم الثيم الفاتح
    // أو نترك لـ DaisyUI حرية اختيار الألوان بناءً على الـ primary
    themes: [
      {
        robcraft: {
          primary: "#6B1D4F",
          secondary: "#A64D79",
          accent: "#4A1436",
          neutral: "#1f2937",
          "base-100": "#ffffff", // خلفية الواجهة
          info: "#0288D1",
          success: "#2E7D32",
          warning: "#ED6C02",
          error: "#D32F2F",
        },
      },
      "light",
      "dark",
    ],
  },
};
