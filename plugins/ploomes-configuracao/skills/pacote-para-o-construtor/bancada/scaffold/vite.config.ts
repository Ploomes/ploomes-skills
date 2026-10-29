import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base relativa: a tela publicada é servida como arquivo estático (como no construtor).
export default defineConfig({ plugins: [react()], base: './' });
