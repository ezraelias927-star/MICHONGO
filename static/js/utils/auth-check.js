
import { authAPI } from '../api/auth.js'; 

export async function checkAndUpdateNav() {
    try {
        const response = await authAPI.checkSession();

        const navRegister = document.getElementById('nav-register');
        const navLogin = document.getElementById('nav-login');
        const navProfile = document.getElementById('nav-profile');
        const navLogoutBtn = document.getElementById('nav-logout-btn');
        const navUserName = document.getElementById('nav-user-name');

        // Kama vimepatikana kwenye ukurasa wa sasa, badilisha hali yao kulingana na session
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

        // Unaweza kurudisha jibu zima kama unataka kulitumia kwenye sehemu nyingine ya code yako
        return response;
    } catch (err) {
        console.error('Hitilafu wakati wa kukagua session:', err);
        return { authenticated: false };
    }
}