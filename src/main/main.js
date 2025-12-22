const { app, BrowserWindow, screen, ipcMain, Tray, Menu, nativeImage } = require('electron');
import path from 'node:path';
import started from 'electron-squirrel-startup';

let tray = null;
let popupWindow = null;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createPopupWindow = () => {
  if (popupWindow && !popupWindow.isDestroyed()) {
    popupWindow.show();
    popupWindow.focus();
    return;
  }

  popupWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    frame: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  // Adjust path to point to renderer output
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    popupWindow.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}/popup.html`);
  } else {
    popupWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/popup.html`));
  }

  popupWindow.on('closed', () => {
    popupWindow = null;
  });
};

const togglePopupWindow = () => {
  if (popupWindow && !popupWindow.isDestroyed()) {
    if (popupWindow.isVisible()) {
      popupWindow.close();
    } else {
      popupWindow.show();
    }
  } else {
    createPopupWindow();
  }
};

const createWindow = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const windowWidth = 450;
  const windowHeight = 350;

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    x: width - windowWidth,
    y: height - windowHeight,
    frame: false,
    transparent: true,
    hasShadow: false,
    alwaysOnTop: true,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
    },
  });

  // IPC Event for Click-through
  ipcMain.on('set-ignore-mouse-events', (event, ignore, options) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    win.setIgnoreMouseEvents(ignore, options);
  });

  // IPC Event for Context Menu
  ipcMain.on('show-context-menu', (event) => {
    const template = [
      {
        label: 'Hide Character',
        click: () => { event.sender.getOwnerBrowserWindow().hide(); }
      },
      { type: 'separator' },
      {
        label: 'Quit',
        click: () => { app.quit(); }
      }
    ];
    const menu = Menu.buildFromTemplate(template);
    menu.popup(BrowserWindow.fromWebContents(event.sender));
  });

  // IPC Event for Popup Window
  ipcMain.on('open-popup', () => {
    createPopupWindow();
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  return mainWindow;
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  const mainWindow = createWindow();

  // Tray Icon 생성
  const iconPath = path.join(__dirname, '../../public/tray-icon.png');
  const icon = nativeImage.createFromPath(iconPath);
  tray = new Tray(icon.resize({ width: 16, height: 16 }));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show/Hide Character',
      click: () => {
        if (mainWindow.isVisible()) {
          mainWindow.hide();
        } else {
          mainWindow.show();
        }
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      }
    }
  ]);

  tray.setToolTip('Live2D Mascot');

  // 좌클릭: 팝업 토글
  tray.on('click', () => {
    togglePopupWindow();
  });

  // 우클릭: 컨텍스트 메뉴 열기
  tray.on('right-click', () => {
    tray.popUpContextMenu(contextMenu);
  });

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  // Python Process Detection
  const { spawn } = require('child_process');

  // Dev environment path adjustment
  // In dev, __dirname is likely .../.vite/build/
  // Source is .../src/main/main.js
  // monitor_processes.py is in src/
  let scriptPath = path.join(__dirname, '../../src/monitor_processes.py');

  // If __dirname includes .vite/build, we need to go up two levels to get to project root then into src
  if (__dirname.includes('.vite/build')) {
    scriptPath = path.join(__dirname, '../../src/monitor_processes.py');
  }

  const pythonProcess = spawn('python3', [scriptPath]);

  console.log(`[Python] Spawning script at: ${scriptPath}`);

  pythonProcess.stdout.on('data', (data) => {
    try {
      const messages = data.toString().trim().split('\n');
      messages.forEach(msg => {
        if (!msg) return;
        const event = JSON.parse(msg);
        if (event.event === 'new_process') {
          console.log(`[Python] New Process Detected: ${event.name} (PID: ${event.pid})`);

          // Focus Guard: 롤(League of Legends) 감지 시 자동 종료
          const distractionNames = ['LeagueClient', 'League of Legends', 'LoL'];
          // 대소문자 구분 없이 포함 여부 확인 (Mac process names can vary)
          if (distractionNames.some(d => event.name.toLowerCase().includes(d.toLowerCase()))) {
            console.log(`[Focus Guard] Distraction Detected: ${event.name} (PID: ${event.pid}). Terminating...`);
            try {
              process.kill(event.pid); // Terminate process
              console.log('[Focus Guard] Process terminated successfully.');

              // Optional: Show a balloon/notification? 
              // For now just console log.
            } catch (err) {
              console.error(`[Focus Guard] Failed to terminate process: ${err.message}`);
            }
          }
        }
      });
    } catch (e) {
      console.error('[Python] Parse Error:', e);
    }
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`[Python API]: ${data}`);
  });

  app.on('will-quit', () => {
    pythonProcess.kill();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
