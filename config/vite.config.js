import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  server: {
    port: 5173,
    open: true,
  },
  publicDir: "public",
  assetsInclude: ["**/*.urdf", "**/*.stl", "**/*.dae", "**/*.obj"],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
