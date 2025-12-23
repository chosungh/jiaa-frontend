import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from '../../lib/AuthContext';
import Avatar from './Avatar';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AuthProvider>
            <Avatar />
        </AuthProvider>
    </React.StrictMode>
);
