import { resolve } from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
    root: 'src/renderer',
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'src/renderer/views/avatar/index.html'),
                login: resolve(__dirname, 'src/renderer/views/login/login.html'),
                signup: resolve(__dirname, 'src/renderer/views/signup/signup.html'),
                dashboard: resolve(__dirname, 'src/renderer/views/dashboard/dashboard.html'),
            },
        },
    },
    publicDir: '../../public',
});
