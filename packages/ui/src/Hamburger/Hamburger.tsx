import React from 'react';
import { Sidebar, SidebarItem } from '../Sidebar/Sidebar';
import './Hamburger.css';

interface HamburgerProps {
    children: React.ReactNode;
    activeTab: 'home' | 'dashboard' | 'group' | 'setting' | 'roadmap';
    isProfileDropdownOpen: boolean;
    onProfileClick: () => void;
    onSignout: () => void;
    onClose: () => void;
    onNavigate: (path: string) => void;
    onProfileDetail?: () => void;
    AvatarCanvas: React.ReactNode;
}

export const Hamburger: React.FC<HamburgerProps> = ({
    children,
    activeTab,
    isProfileDropdownOpen,
    onProfileClick,
    onSignout,
    onClose,
    onNavigate,
    onProfileDetail,
    AvatarCanvas
}) => {
    const sidebarItems: SidebarItem[] = [
        {
            id: 'home',
            icon: '/Home Icon 16px.svg',
            label: '홈',
            active: activeTab === 'home',
            onClick: () => onNavigate('../dashboard/dashboard.html')
        },
        {
            id: 'roadmap',
            icon: '/DashBoard Icon 24px.svg',
            label: '로드맵',
            active: activeTab === 'roadmap',
            onClick: () => onNavigate('../roadmap/roadmap.html')
        },
        {
            id: 'group',
            icon: '/Group Icon 24px.svg',
            label: '그룹',
            active: activeTab === 'group',
            onClick: () => onNavigate('../social/social.html')
        },
        {
            id: 'setting',
            icon: '/Setting Icon 24px.svg',
            label: '설정',
            active: activeTab === 'setting',
            onClick: () => onNavigate('setting')
        }
    ];

    return (
        <div className="hamburger-layout">
            <Sidebar
                items={sidebarItems}
                isProfileDropdownOpen={isProfileDropdownOpen}
                onProfileClick={onProfileClick}
                onSignout={onSignout}
                onProfileDetail={onProfileDetail}
            />

            <main className="main-content">
                <button className="global-close-btn" onClick={onClose}>&times;</button>
                {children}
            </main>

            <div className="avatar-sidebar-container">
                {AvatarCanvas}
            </div>
        </div>
    );
};
