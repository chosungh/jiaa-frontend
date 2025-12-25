import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { Live2DManager } from '../../managers/Live2DManager';
import { signout } from '../../store/slices/authSlice';
import './social.css';

const Social: React.FC = () => {
    console.log('[Social] Rendering Social component');
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [modalTab, setModalTab] = useState<'create' | 'join'>('create');
    const [groupPermission, setGroupPermission] = useState<'strict' | 'open'>('strict');
    const dispatch = useAppDispatch();
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleSignout = async () => {
        dispatch(signout());
        await window.electronAPI.deleteRefreshToken();
        window.electronAPI.closeDashboard();
    };

    // Live2D Init
    useEffect(() => {
        if (!canvasRef.current) return;

        const init = async () => {
            if (!canvasRef.current) return;
            const manager = Live2DManager.getInstance();
            manager.initialize(canvasRef.current);
            manager.enableSync();
        };

        init();

        return () => {
            const manager = Live2DManager.getInstance();
            manager.disableSync();
            Live2DManager.releaseInstance();
        };
    }, []);

    const handleClose = () => {
        window.electronAPI?.closeDashboard();
    };

    const handleOpenDashboard = () => {
        window.location.href = '../dashboard/dashboard.html';
    };

    const handleSetting = () => {
        window.electronAPI?.openSetting();
    };

    const handleOpenProfile = () => {
        window.electronAPI.openProfile();
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const manager = Live2DManager.getInstance();
        manager.onMouseMove(x, y);
    };

    // Mock data for recommended users
    const recommendedUsers = [
        { id: 1, name: '김철수', avatar: '🎮' },
        { id: 2, name: '이영희', avatar: '📚' },
        { id: 3, name: '박민수', avatar: '💻' },
        { id: 4, name: '정수진', avatar: '🎨' },
    ];

    // Mock data for friend groups
    const friendGroups = [
        { id: 1, name: '스터디 그룹', members: 8, avatar: '📖' },
        { id: 2, name: '게임 친구들', members: 12, avatar: '🎮' },
        { id: 3, name: '개발자 모임', members: 15, avatar: '💻' },
        { id: 4, name: '운동 메이트', members: 6, avatar: '🏃' },
    ];

    // Mock data for my groups
    const myGroups = [
        { id: 1, name: 'React 스터디', members: 10, avatar: '⚛️' },
        { id: 2, name: '알고리즘 연습', members: 8, avatar: '🧮' },
        { id: 3, name: '프로젝트 팀', members: 5, avatar: '🚀' },
        { id: 4, name: '독서 모임', members: 7, avatar: '📚' },
    ];

    return (
        <>
            <button className="close-btn" id="close-btn" onClick={handleClose}>&times;</button>
            <div className="dashboard-wrapper">
                {/* Sidebar */}
                <nav className="sidebar">
                    <div className="nav-item profile" onClick={toggleDropdown} ref={dropdownRef}>
                        <div className="profile-circle"></div>
                        {isDropdownOpen && (
                            <div className="dropdown-menu">
                                <div className="dropdown-item" onClick={handleOpenProfile}>내 프로필</div>
                                <div className="dropdown-item" onClick={handleSignout}>로그아웃</div>
                            </div>
                        )}
                    </div>
                    <div className="nav-group">
                        <div className="nav-item" onClick={handleOpenDashboard} style={{ cursor: 'pointer' }}>
                            <img src="/Home Icon 16px.svg" alt="" />
                        </div>
                        <div className="nav-item">
                            <img src="/DashBoard Icon 24px.svg" alt="" />
                        </div>
                        <div className="nav-item active">
                            <img src="/Group Icon 24px.svg" alt="" />
                        </div>
                        <a id="signup-link" onClick={handleSetting} style={{ cursor: 'pointer' }}>
                            <div className="nav-item">
                                <img src="/Setting Icon 24px.svg" alt="" />
                            </div>
                        </a>
                    </div>
                </nav>

                <div className="social-main-container">
                    {/* Search Bar */}
                    <div className="search-container">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="검색"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Content Area */}
                    <div className="social-content-wrapper">
                        {/* Recommended Users Section */}
                        <section className="social-section">
                            <div className="section-header">
                                <h2>추천 사용자</h2>
                                <button className="scroll-btn">›</button>
                            </div>
                            <div className="horizontal-scroll">
                                {recommendedUsers.map(user => (
                                    <div key={user.id} className="user-card">
                                        <div className="user-card-avatar">{user.avatar}</div>
                                        <div className="user-card-name">{user.name}</div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Friend Groups Section */}
                        <section className="social-section">
                            <div className="section-header">
                                <h2>친구 Group</h2>
                            </div>
                            <div className="groups-grid">
                                {friendGroups.map(group => (
                                    <div key={group.id} className="group-card">
                                        <div className="group-card-avatar">{group.avatar}</div>
                                        <div className="group-card-info">
                                            <div className="group-card-name">{group.name}</div>
                                            <div className="group-card-members">{group.members}명</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* My Groups Section */}
                        <section className="social-section">
                            <div className="section-header">
                                <h2>내가 참여 중인 Group</h2>
                            </div>
                            <div className="groups-grid">
                                {myGroups.map(group => (
                                    <div key={group.id} className="group-card">
                                        <div className="group-card-avatar">{group.avatar}</div>
                                        <div className="group-card-info">
                                            <div className="group-card-name">{group.name}</div>
                                            <div className="group-card-members">{group.members}명</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Create Group Button */}
                        <button className="create-group-btn" onClick={() => setIsCreateModalOpen(true)}>Group 생성하기</button>
                    </div>
                </div>

                {/* Avatar Canvas */}
                <div className="avatar-container">
                    <canvas ref={canvasRef} id="live2d-social" onMouseMove={handleMouseMove}></canvas>
                </div>
            </div>

            {/* Create Group Modal */}
            {isCreateModalOpen && (
                <div className="modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Group 생성</h2>
                        </div>

                        {/* Tabs */}
                        <div className="modal-tabs">
                            <button
                                className={`modal-tab ${modalTab === 'create' ? 'active' : ''}`}
                                onClick={() => setModalTab('create')}
                            >
                                생성
                            </button>
                            <button
                                className={`modal-tab ${modalTab === 'join' ? 'active' : ''}`}
                                onClick={() => setModalTab('join')}
                            >
                                참여
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="modal-body">
                            {modalTab === 'create' ? (
                                <>
                                    {/* Permission Section */}
                                    <div className="modal-section">
                                        <h3>권한</h3>
                                        <div className="permission-options">
                                            <button
                                                className={`permission-btn ${groupPermission === 'strict' ? 'active' : ''}`}
                                                onClick={() => setGroupPermission('strict')}
                                            >
                                                <div className="radio-icon"></div>
                                                <span>강력한 권한</span>
                                            </button>
                                            <button
                                                className={`permission-btn ${groupPermission === 'open' ? 'active' : ''}`}
                                                onClick={() => setGroupPermission('open')}
                                            >
                                                <div className="radio-icon"></div>
                                                <span>동등한 권한</span>
                                            </button>
                                        </div>
                                        <p className="permission-description">
                                            강력한 권한은 주로 업무, 교육의 목적으로 사용되며 Group 생성자가 구성원의 행동을 확인할 수 있습니다
                                        </p>
                                    </div>

                                    {/* Detail Settings Section */}
                                    <div className="modal-section">
                                        <div className="detail-settings-placeholder">
                                            <p>세부설정</p>
                                        </div>
                                    </div>

                                    {/* Create Button */}
                                    <button className="modal-submit-btn">Group 생성하기</button>
                                </>
                            ) : (
                                <div className="join-content">
                                    <div className="modal-section">
                                        <h3>Group 코드</h3>
                                        <input
                                            type="text"
                                            className="code-input"
                                            placeholder="초대 코드를 입력하세요"
                                        />
                                        <p className="code-description">
                                            친구로부터 받은 Group 초대 코드를 입력하면 해당 그룹에 참여할 수 있습니다.
                                        </p>
                                    </div>
                                    <button className="modal-submit-btn">Group 참여하기</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Social;
