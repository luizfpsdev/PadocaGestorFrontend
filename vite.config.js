import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from "path"
import tsconfigPaths from "vite-tsconfig-paths"



export default defineConfig({
  plugins: [react(),tsconfigPaths()],
  define: {
    __APP_ENV__: JSON.stringify(process.env.VITE_APP_ENV), // se quiser criar um global
  },
 optimizeDeps: {
    include: [
      "@chakra-ui/react",
      "@emotion/react",
      "@emotion/styled",
      "framer-motion"
    ],
  },
});
