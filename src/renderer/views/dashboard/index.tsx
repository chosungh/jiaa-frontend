import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from '../../lib/AuthContext';
import Dashboard from './Dashboard';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AuthProvider>
            <Dashboard />
        </AuthProvider>
    </React.StrictMode>
);
