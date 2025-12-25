import React, { useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { MainLayout } from '../../components/MainLayout/MainLayout';
import './setting.css';

const Setting: React.FC = () => {
    const [screenMode, setScreenMode] = useState<'light' | 'dark'>('dark');
    const user = useAppSelector((state) => state.auth.user);

    return (
        <MainLayout activeTab="setting">
            <div className="setting-container">
                <div className="setting-content">
                    <h1 className="setting-title">설정</h1>
                    <h2 className="setting-subtitle">화면 설정</h2>

                    {/* 화면 모드 섹션 */}
                    <div className="setting-section">
                        <label className="setting-label">화면모드</label>
                        <div className="mode-buttons">
                            <button
                                className={`mode-button ${screenMode === 'light' ? 'active' : ''}`}
                                onClick={() => setScreenMode('light')}
                            >
                                화이트 모드
                            </button>
                            <button
                                className={`mode-button ${screenMode === 'dark' ? 'active' : ''}`}
                                onClick={() => setScreenMode('dark')}
                            >
                                다크 모드
                            </button>
                        </div>
                    </div>

                    {/* 아바타 섹션 */}
                    <div className="setting-section">
                        <label className="setting-label">아바타</label>
                        <p className="setting-description">아바타에 대한 세부설명</p>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Setting;
