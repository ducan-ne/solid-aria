import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'
import {
  narrowSolidPlugin,
} from './narrowSolidPlugin'

export default defineConfig({
  plugins: [
    narrowSolidPlugin({ include: [/\/src/, /\/src\/bridge\/solid/] }),
    react({
      include: [/\/react/, /\/src\/bridge\/react/],
      exclude: /\/src/
    }),
  ],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});
