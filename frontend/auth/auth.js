document.addEventListener('DOMContentLoaded', () => {
    const loginSection = document.getElementById('login-section');
    const registerSection = document.getElementById('register-section');
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    const loginError = document.getElementById('login-error');
    const regError = document.getElementById('reg-error');

    // Switch between forms
    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginSection.classList.add('hidden');
        registerSection.classList.remove('hidden');
    });

    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerSection.classList.add('hidden');
        loginSection.classList.remove('hidden');
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        loginError.textContent = '';
        loginError.style.color = ''; // Reset to default (red)

        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Signing In...';
        submitBtn.disabled = true;

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('ss_token', data.token);
                localStorage.setItem('ss_user', JSON.stringify(data.user));
                window.location.href = '../index.html';
            } else {
                loginError.textContent = data.error || 'Login failed';
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        } catch (err) {
            loginError.textContent = 'Server error. Please try again.';
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });

    // Handle Register
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        regError.textContent = '';

        const submitBtn = registerForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Creating Account...';
        submitBtn.disabled = true;

        const name = document.getElementById('reg-name').value;
        const studentId = document.getElementById('reg-id').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, studentId, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Return to login logic
                registerSection.classList.add('hidden');
                loginSection.classList.remove('hidden');

                // Show success message in login error area (styled as success)
                loginError.textContent = 'Registration successful! Please sign in.';
                loginError.style.color = '#10b981'; // Green

                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            } else {
                regError.textContent = data.error || 'Registration failed';
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        } catch (err) {
            regError.textContent = 'Server error. Please try again.';
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
});
