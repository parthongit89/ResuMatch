

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