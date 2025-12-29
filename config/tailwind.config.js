/** @type {import('tailwindcss').Config} */
export default {
  // مهم جداً: حدد المسارات لكي يشتغل التايلوند في الـ HTML والـ JS
 content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
],
  theme: {
    extend: {
      colors: {
        "dark-bg": "#232931", // لونك الاحترافي
        "robot-green": "#005f4e",
      },
    },
  },
  // ربط DaisyUI
  plugins: [require("daisyui")],
   
  // إعدادات اختيارية لـ DaisyUI   
  daisyui: {
    themes: ["dark"], // ليكون الشكل غامق تلقائياً
  },
}      