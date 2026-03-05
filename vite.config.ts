import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "127.0.0.1",
    port: 5178,
    strictPort: true,
  },
  optimizeDeps: {
    // Vite sometimes corrupts the optimized dep file for this package on certain setups.
    // Excluding it forces native ESM loading (slower startup, but stable).
    exclude: ["@tanstack/react-query"],
  },
});
