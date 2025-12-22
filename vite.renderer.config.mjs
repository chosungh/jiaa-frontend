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
                signup: resolve(__dirname, 'src/renderer/signup.html'),
                dashboard: resolve(__dirname, 'src/renderer/dashboard.html'),
            },
        },
    },
    publicDir: '../../public',
});
