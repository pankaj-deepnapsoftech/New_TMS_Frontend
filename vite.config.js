/* eslint-disable no-undef */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from "path";
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  resolve:{
    alias:{
      "@": path.resolve(__dirname,"src"),
      "@pages": path.resolve(__dirname,"src/pages"),
      "@components": path.resolve(__dirname,"src/components"),
      "@store": path.resolve(__dirname,"src/store"),
    }
  },
  server:{
    port:4000
  }
})
