import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// so that we can import svg files as react components and  still have them as sepparate files that can be edited with a vector grafic editor
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
// https://tailwindcss.com/docs/installation/using-vite
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    svgr(),
  ],
  build: {
    assetsInlineLimit: 0,
    sourcemap: true,
  },
});
