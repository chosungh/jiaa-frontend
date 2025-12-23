import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    setIgnoreMouseEvents: (ignore: boolean, options?: any) => ipcRenderer.send('set-ignore-mouse-events', ignore, options),
    showContextMenu: () => ipcRenderer.send('show-context-menu'),
    openLogin: () => ipcRenderer.send('open-login'),
    openSignup: () => ipcRenderer.send('open-signup'),
    closeLogin: () => ipcRenderer.send('close-login'),
    closeDashboard: () => ipcRenderer.send('close-dashboard'),
    loginSuccess: (email: string) => ipcRenderer.send('login-success', email),
});
