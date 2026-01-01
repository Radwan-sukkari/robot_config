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
       "dark-bg": "#232931",
        "primary": "#004d40",
        "primary-dark": "#00332c",
        "custom-teal": "#4ECCA3"
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