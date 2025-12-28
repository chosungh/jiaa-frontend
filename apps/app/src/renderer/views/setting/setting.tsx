import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { signout as signoutAction } from '../../store/slices/authSlice';
import { setTheme, type Theme } from '../../store/slices/themeSlice';
import { signout } from '../../services/api';
import './setting.css';

const Setting: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const currentTheme = useAppSelector((state) => state.theme.theme);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleThemeChange = (newTheme: Theme) => {
        dispatch(setTheme(newTheme));
    };

    const handleLogout = async () => {
        if (isLoggingOut) return;

        setIsLoggingOut(true);
        try {
            console.log('[Setting] Logging out...');
            await signout();
            dispatch(signoutAction());
            console.log('[Setting] Logout successful, redirecting to signin...');
            navigate('/signin');
        } catch (error) {
            console.error('[Setting] Logout error:', error);
            // 에러가 발생해도 로컬 토큰은 이미 삭제됨 (signout 함수에서 처리)
            dispatch(signoutAction());
            navigate('/signin');
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <div className="setting-container">
            <header className="header">
                <h1>설정</h1>
            </header>
            <div className="setting-content">
                <h2 className="setting-subtitle">화면 설정</h2>

                {/* 화면 모드 섹션 */}
                <div className="setting-section">
                    <div className="mode-buttons">
                        <button
                            className={`mode-button ${currentTheme === 'light' ? 'active' : ''}`}
                            onClick={() => handleThemeChange('light')}
                        >
                            화이트 모드
                        </button>
                        <button
                            className={`mode-button ${currentTheme === 'dark' ? 'active' : ''}`}
                            onClick={() => handleThemeChange('dark')}
                        >
                            다크 모드
                        </button>
                        <button
                            className={`mode-button ${currentTheme === 'system' ? 'active' : ''}`}
                            onClick={() => handleThemeChange('system')}
                        >
                            시스템 설정
                        </button>
                    </div>
                </div>

                {/* 계정 섹션 */}
                <h2 className="setting-subtitle">계정</h2>
                <div className="setting-section">
                    <p className="setting-description">현재 계정에서 로그아웃합니다.</p>
                    <button
                        className="logout-button"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                    >
                        {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Setting;