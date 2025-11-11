import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { envReloadPlugin } from "./vite-plugin-env-reload";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "localhost",
    port: 5173,
  },


  plugins: [
    react(),
    envReloadPlugin()
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'stripe-vendor': ['@stripe/stripe-js', '@stripe/react-stripe-js'],
          'ui-vendor': ['lucide-react', 'recharts'],
        },
      },
    },
  },
}));
