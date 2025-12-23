export { };

declare global {
    interface Window {
        electronAPI: {
            openLogin: () => void;
            openSignup: () => void;
            loginSuccess: (email: string) => void;
            showContextMenu: () => void;
            closeDashboard: () => void;
            setIgnoreMouseEvents: (ignore: boolean, options?: { forward: boolean }) => void;
        };
    }
}
