/**
 * MICHONGO - Navigation Auth & Logout Controller (Auto-refresh state)
 */
import { authAPI } from '../api/auth.js';

// 1. WEKA FUNCTION YA KUKAGUA SESSION ILI IWEZE KUITWA WAKATI WOWOTE
export async function checkAndUpdateNav() {
    try {
        const response = await authAPI.checkSession();

        const navRegister = document.getElementById('nav-register');
        const navLogin = document.getElementById('nav-login');
        const navProfile = document.getElementById('nav-profile');
        const navLogoutBtn = document.getElementById('nav-logout-btn');
        const navUserName = document.getElementById('nav-user-name');

        if (navRegister) {
            if (response && response.authenticated) {
                // --- MTU AMELOGIN ---
                navRegister.classList.add('hidden');
                navLogin.classList.add('hidden');
                navProfile.classList.remove('hidden');
                navLogoutBtn.classList.remove('hidden');

                if (navUserName && response.user) {
                    navUserName.textContent = response.user.username;
                }
            } else {
                // --- NI MGENI ---
                navRegister.classList.remove('hidden');
                navLogin.classList.remove('hidden');
                navProfile.classList.add('hidden');
                navLogoutBtn.classList.add('hidden');
            }
        }
    } catch (err) {
        console.error('Hitilafu wakati wa kuangalia session:', err);
    }
}

// 2. ENDESHA WAKATI UKURASA UNALOAD KWA MARA YA KWANZA
document.addEventListener('DOMContentLoaded', () => {
    checkAndUpdateNav();

    // --- LOGOUT MODAL & INTERACTION LOGIC ---
    const logoutBtn = document.getElementById('nav-logout-btn');
    const logoutModal = document.getElementById('logout-modal');
    const cancelBtn = document.getElementById('modal-cancel-btn');
    const confirmBtn = document.getElementById('modal-confirm-btn');

    if (logoutBtn && logoutModal) {
        logoutBtn.addEventListener('click', () => {
            logoutModal.classList.remove('hidden');
        });
    }

    if (cancelBtn && logoutModal) {
        cancelBtn.addEventListener('click', () => {
            logoutModal.classList.add('hidden');
        });
    }

    if (confirmBtn) {
        confirmBtn.addEventListener('click', async () => {
            try {
                const res = await authAPI.logout();
                if (res && res.success !== false) {
                    // Baada ya kutoka, sasisha nav papohapo bila hard reload ya lazima
                    await checkAndUpdateNav();
                    logoutModal.classList.add('hidden');
                    window.location.hash = '#/';
                } else {
                    alert('Imeshindikana kutoka kwenye akaunti.');
                }
            } catch (error) {
                console.error('Logout error:', error);
            }
        });
    }
});