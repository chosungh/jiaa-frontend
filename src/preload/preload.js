const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    setIgnoreMouseEvents: (ignore, options) => ipcRenderer.send('set-ignore-mouse-events', ignore, options),
    showContextMenu: () => ipcRenderer.send('show-context-menu'),
    openSignup: () => ipcRenderer.send('open-signup'),
    closeLogin: () => ipcRenderer.send('close-login'),
    closeDashboard: () => ipcRenderer.send('close-dashboard'),
    loginSuccess: (email) => ipcRenderer.send('login-success', email),
});
