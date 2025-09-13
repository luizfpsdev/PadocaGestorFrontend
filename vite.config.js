import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(),tailwindcss()],
  define: {
    __APP_ENV__: JSON.stringify(process.env.VITE_APP_ENV), // se quiser criar um global
  },
});
