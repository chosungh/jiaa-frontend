import { Tray, Menu, nativeImage, app } from 'electron';
import path from 'node:path';
import { getAvatarWindow } from '../windows/manager';
import { toggleMainWindow } from '../windows/mainWindow';

let tray: Tray | null = null;

export const createTray = (): void => {
    // Tray Icon 생성
    const iconPath = path.join(__dirname, '../../public/tray-icon.png');
    const icon = nativeImage.createFromPath(iconPath);
    tray = new Tray(icon.resize({ width: 16, height: 16 }));

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show/Hide Character',
            click: () => {
                const avatarWindow = getAvatarWindow();
                if (avatarWindow && !avatarWindow.isDestroyed()) {
                    if (avatarWindow.isVisible()) {
                        avatarWindow.hide();
                    } else {
                        avatarWindow.show();
                    }
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

    // 좌클릭: 로그인/설정 토글 -> MainWindow Toggle
    tray.on('click', () => {
        toggleMainWindow();
    });

    // 우클릭: 컨텍스트 메뉴 열기
    tray.on('right-click', () => {
        if (tray) {
            tray.popUpContextMenu(contextMenu);
        }
    });
};
