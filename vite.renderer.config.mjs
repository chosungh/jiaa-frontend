import { resolve } from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
    root: 'src/renderer',
    build: {
        rollupOptions: {
            input: {
                main_window: resolve(__dirname, 'src/renderer/index.html'),
                popup: resolve(__dirname, 'src/renderer/popup.html'),
            },
        },
    },
    publicDir: '../../public',
});
