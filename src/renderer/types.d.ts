export { };

declare global {
    interface Window {
        electronAPI: {
            openSignin: () => void;
            openSignup: () => void;
            signinSuccess: (email: string) => void;
            showContextMenu: () => void;
            closeDashboard: () => void;
            setIgnoreMouseEvents: (ignore: boolean, options?: { forward: boolean }) => void;
            saveRefreshToken: (token: string) => Promise<{ success: boolean; error?: string }>;
            getRefreshToken: () => Promise<string | null>;
            deleteRefreshToken: () => Promise<{ success: boolean }>;
        };
    }
}
