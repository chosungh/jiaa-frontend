const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    setIgnoreMouseEvents: (ignore, options) => ipcRenderer.send('set-ignore-mouse-events', ignore, options),
    showContextMenu: () => ipcRenderer.send('show-context-menu'),
    openLogin: () => ipcRenderer.send('open-login'),
    loginSuccess: (email) => ipcRenderer.send('login-success', email),
});
