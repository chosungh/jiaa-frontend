import { resolve } from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
    root: 'src/renderer',
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'src/renderer/index.html'),
                login: resolve(__dirname, 'src/renderer/login.html'),
            },
        },
    },
    publicDir: '../../public',
});
