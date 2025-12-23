import React, { useState } from 'react';
import './signup.css';

const Signup: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        if (email && password) {
            console.log('Signup attempt:', { email });
            // For now, just simulate success and go back to login or auto-login
            alert('Account created! Please log in.');
            window.electronAPI?.openLogin();
        } else {
            alert('Please fill in all fields');
        }
    };

    const handleBackToLogin = () => {
        window.electronAPI?.openLogin();
    };

    return (
        <div className="signup-container">
            <h1>회원가입</h1>
            <form id="signup-form" onSubmit={handleSubmit} noValidate>
                <div className="input-group">
                    <input
                        type="email"
                        id="email"
                        required
                        autoComplete="off"
                        placeholder=" "
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label htmlFor="email">이메일</label>
                </div>
                <div className="input-group">
                    <input
                        type="password"
                        id="password"
                        required
                        placeholder=" "
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label htmlFor="password">비밀번호</label>
                </div>
                <div className="input-group">
                    <input
                        type="password"
                        id="confirm-password"
                        required
                        placeholder=" "
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <label htmlFor="confirm-password">비밀번호 확인</label>
                </div>
                <button type="submit" className="signup-btn">회원가입</button>
            </form>
            <div className="footer">
                <a id="back-to-login" onClick={handleBackToLogin} style={{ cursor: 'pointer' }}>이미 회원이신가요?</a>
            </div>
        </div>
    );
};

export default Signup;
