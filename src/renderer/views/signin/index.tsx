import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from '../../lib/AuthContext';
import Signin from './Signin';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AuthProvider>
            <Signin />
        </AuthProvider>
    </React.StrictMode>
);
