import { defineConfig } from 'vite';

// Keep Vite internals using Node's crypto explicitly.
export default defineConfig({
  resolve: {
    alias: {
      crypto: 'node:crypto',
    },
  },
});