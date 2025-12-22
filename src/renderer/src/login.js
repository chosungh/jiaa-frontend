document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const closeBtn = document.getElementById('close-btn');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = emailInput.value;
        const password = passwordInput.value;

        if (email && password) {
            console.log('Login attempt:', { email, password: '***' });
            // Send IPC message to the main process
            window.electronAPI.loginSuccess(email);
        } else {
            alert('Please fill in all fields');
        }
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            // Assuming functionality to close popup via IPC if needed
            // window.close(); 
            // Or send event to main process to hide
            console.log('Close clicked');
        });
    }
});
