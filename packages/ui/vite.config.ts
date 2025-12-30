import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// StorybookとVitestの両方がこの設定を利用する
export default defineConfig({
  plugins: [
    react(),
  ],
});
