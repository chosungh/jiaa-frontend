
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
    accessToken: string | null;
    isAuthenticated: boolean;
    signin: (tokens: { accessToken: string; refreshToken: string; email: string }) => Promise<void>;
    signout: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const storedRefreshToken = await window.electronAPI.getRefreshToken();
                if (storedRefreshToken) {
                    // In a real app, we would send this refresh token to the backend 
                    // to get a new access token.
                    // For now, we simulate this by assuming if we have a refresh token, we are logged in.

                    // Mocking Access Token retrieval
                    console.log('[AuthContext] Found refresh token, refreshing access token...');
                    const simulatedNewAccessToken = 'mock-access-token-' + Date.now();
                    setAccessToken(simulatedNewAccessToken);
                }
            } catch (error) {
                console.error('[AuthContext] Failed to init auth:', error);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const signin = async ({ accessToken, refreshToken, email }: { accessToken: string; refreshToken: string; email: string }) => {
        setAccessToken(accessToken);
        await window.electronAPI.saveRefreshToken(refreshToken);
        window.electronAPI.signinSuccess(email);
    };

    const signout = async () => {
        setAccessToken(null);
        await window.electronAPI.deleteRefreshToken();
        // Since this is likely calling main process to close windows/etc, 
        // we might need more logic here if we were strictly SPA.
        // But current architecture handles "signinSuccess" -> Dashboard.
        // "signout" -> should probably close dashboard and open signin.
        // Current existing IPC 'close-dashboard' does this.
        window.electronAPI.closeDashboard();
    };

    const isAuthenticated = !!accessToken;

    return (
        <AuthContext.Provider value={{ accessToken, isAuthenticated, signin, signout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
