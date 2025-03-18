// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [react(), svgr()],
  build: {
    minify: "esbuild", // Use esbuild to minimize the code
    sourcemap: false, // Disable source maps for production
  },
});
