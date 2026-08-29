/* ==========================================================================
   RESUMATCH — AUTH DEMO & FLASK API INTEGRATION SCRIPT
   ========================================================================== */

"use strict";

// API Base URL (Local Flask Server / Production Render Backend)
const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://127.0.0.1:5000/api/v1'
    : (window.location.hostname.endsWith('onrender.com') 
        ? `${window.location.origin}/api/v1`
        : 'https://resumatch-api-jkau.onrender.com/api/v1');

/* ==========================================================================
   1. TOAST NOTIFICATIONS
   ========================================================================== */
const Toast = {
    container: null,

    init() {
        this.container = document.getElementById('toastContainer');
    },

    show(message, type = 'info', duration = 3500) {
        if (!this.container) this.init();

        const toast = document.createElement('div');
        toast.className = `toast-message ${type}`;

        let icon = "<i class='bx bx-info-circle' style='color:var(--primary-light);font-size:1.25rem;'></i>";
        if (type === 'success') {
            icon = "<i class='bx bx-check-circle' style='color:var(--match-green);font-size:1.25rem;'></i>";
        } else if (type === 'error') {
            icon = "<i class='bx bx-error-circle' style='color:var(--missing-red);font-size:1.25rem;'></i>";
        }

        toast.innerHTML = `${icon}<span>${message}</span>`;
        this.container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(15px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, duration);
    }
};

/* ==========================================================================
   2. THEME MANAGER
   ========================================================================== */
const ThemeManager = {
    storageKey: 'resumatch_auth_theme',

    init() {
        const saved = localStorage.getItem(this.storageKey) || 'dark';
        this.setTheme(saved);

        const toggleBtn = document.getElementById('authThemeToggleBtn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const current = document.documentElement.getAttribute('data-theme') || 'dark';
                const next = current === 'dark' ? 'light' : 'dark';
                this.setTheme(next);
                Toast.show(`Switched to ${next} mode`, 'info', 1800);
            });
        }
    },

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(this.storageKey, theme);
    }
};

/* ==========================================================================
   3. AUTH DEMO & API HANDLERS
   ========================================================================== */
const AuthDemo = {
    container: null,
    currentEmail: '',

    init() {
        this.container = document.getElementById('authContainer');
        this.silentWarmUp();
    },

    // Solution 1: Silent Backend Warm-Up Ping on Landing/Auth Load
    silentWarmUp() {
        fetch(`${API_BASE_URL}/health`, { method: 'GET', mode: 'cors' })
            .then(res => res.json())
            .then(data => console.log('[ResuMatch API] Server status:', data.message))
            .catch(() => console.log('[ResuMatch API] Waking up backend in background...'));
    },

    showSignUp() {
        if (this.container) this.container.classList.add('active');
    },

    showSignIn() {
        if (this.container) this.container.classList.remove('active');
    },

    togglePasswordVisibility(inputId, btn) {
        const input = document.getElementById(inputId);
        if (!input) return;
        const icon = btn.querySelector('i');
        if (input.type === 'password') {
            input.type = 'text';
            if (icon) icon.className = 'bx bx-hide';
        } else {
            input.type = 'password';
            if (icon) icon.className = 'bx bx-show';
        }
    },

    async handleSignUp(event) {
        event.preventDefault();
        const fullName = document.getElementById('regName').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value;

        Toast.show('Creating account & sending OTP email...', 'info', 3000);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ full_name: fullName, email: email, password: password })
            });

            const data = await response.json();

            if (data.success) {
                Toast.show(data.message || 'Registration successful! OTP sent to your email.', 'success', 5000);
                this.openOTPModal(email);
            } else {
                Toast.show(data.message || 'Registration failed', 'error', 4000);
            }
        } catch (err) {
            Toast.show('Network error or server waking up. Please try again.', 'error', 4000);
        }
    },

    async handleSignIn(event) {
        event.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        Toast.show('Signing in...', 'info', 2500);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, password: password })
            });

            const data = await response.json();

            if (data.success) {
                Toast.show(data.message || 'Credentials verified! OTP sent to your email.', 'success', 4000);
                this.openOTPModal(email);
            } else {
                Toast.show(data.message || 'Invalid email or password', 'error', 4000);
            }
        } catch (err) {
            Toast.show('Network error or server waking up. Please try again.', 'error', 4000);
        }
    },

    /* --- OTP MODAL CONTROLS --- */
    openOTPModal(email) {
        this.currentEmail = email;
        const targetEmailEl = document.getElementById('otpTargetEmail');
        if (targetEmailEl) targetEmailEl.textContent = email;
        const modal = document.getElementById('otpModal');
        if (modal) {
            modal.classList.add('open');
            const otpInput = document.getElementById('otpCodeInput');
            if (otpInput) {
                otpInput.value = '';
                otpInput.focus();
            }
        }
    },

    closeOTPModal() {
        const modal = document.getElementById('otpModal');
        if (modal) modal.classList.remove('open');
    },

    async submitOTPModal() {
        const otpInput = document.getElementById('otpCodeInput');
        if (!otpInput) return;
        const otpCode = otpInput.value.trim();

        if (otpCode.length !== 6) {
            Toast.show('Please enter a valid 6-digit OTP code', 'error', 3000);
            return;
        }

        Toast.show('Verifying OTP code...', 'info', 2000);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: this.currentEmail, otp_code: otpCode })
            });

            const data = await response.json();

            if (data.success) {
                Toast.show('OTP Verified Successfully! Access Granted.', 'success', 3000);
                if (data.data && data.data.access_token) {
                    localStorage.setItem('resumatch_token', data.data.access_token);
                }
                this.triggerDashboardRedirect('Verification Successful!', 'Email identity confirmed. Launching dashboard workspace...');
            } else {
                Toast.show(data.message || 'Invalid or expired OTP code', 'error', 4000);
            }
        } catch (err) {
            Toast.show('Failed to verify OTP. Please try again.', 'error', 4000);
        }
    },

    async resendOTPModal() {
        if (!this.currentEmail) return;
        Toast.show('Resending OTP code...', 'info', 2500);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: this.currentEmail })
            });

            const data = await response.json();
            if (data.success) {
                Toast.show('New 6-digit OTP sent to your email!', 'success', 4000);
            } else {
                Toast.show(data.message || 'Failed to resend OTP', 'error', 4000);
            }
        } catch (err) {
            Toast.show('Network error while resending OTP', 'error', 4000);
        }
    },

    triggerDashboardRedirect(title = "Verification Successful!", subtitle = "Authenticating session credentials... Redirecting to dashboard.") {
        this.closeOTPModal();
        const loaderModal = document.getElementById('verificationLoaderModal');
        const loaderTitle = document.getElementById('loaderTitle');
        const loaderSubtitle = document.getElementById('loaderSubtitle');
        const progressBar = document.getElementById('loaderProgressBar');

        if (loaderTitle) loaderTitle.textContent = title;
        if (loaderSubtitle) loaderSubtitle.textContent = subtitle;

        if (loaderModal) {
            loaderModal.classList.add('open');
            setTimeout(() => {
                if (progressBar) progressBar.style.width = '100%';
            }, 100);

            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1400);
        } else {
            window.location.href = '/dashboard';
        }
    },

    socialAuth(provider) {
        if (provider === 'Google' && typeof window.firebaseGoogleAuth === 'function') {
            window.firebaseGoogleAuth();
        } else if (provider === 'GitHub' && typeof window.firebaseGithubAuth === 'function') {
            window.firebaseGithubAuth();
        } else {
            Toast.show(`${provider} OAuth Authentication requested.`, 'info', 2500);
        }
    },

    forgotPassword() {
        const email = prompt('Enter your registered email address for password recovery:');
        if (email) {
            Toast.show(`Password reset link sent to ${email}`, 'info', 3500);
        }
    }
};

// Initialize Managers on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
    AuthDemo.init();
});
