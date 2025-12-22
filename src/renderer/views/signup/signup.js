document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const backToLoginBtn = document.getElementById('back-to-login');

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = emailInput.value;
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        if (email && password) {
            console.log('Signup attempt:', { email });
            // For now, just simulate success and go back to login or auto-login
            // In a real app, you would send this to the main process -> backend
            alert('Account created! Please log in.');
            window.electronAPI.openLogin();
        } else {
            alert('Please fill in all fields');
        }
    });

    if (backToLoginBtn) {
        backToLoginBtn.addEventListener('click', () => {
            window.electronAPI.openLogin();
        });
    }
});
