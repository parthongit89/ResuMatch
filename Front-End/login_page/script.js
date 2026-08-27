

"use strict";








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