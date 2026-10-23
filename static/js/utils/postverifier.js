import { authAPI } from '../api/auth.js';

export function setupAuthGuard() {
    document.addEventListener('click', async (e) => {
        const postLink = e.target.closest('a[href="#/new"]');
        
        if (postLink) {
            e.preventDefault();

            try {
                const response = await authAPI.checkSession();

                if (response && response.authenticated) {
                    // Amelogin - Mruhusu aende
                    window.location.hash = '#/new';
                } else {
                    // 1. Hifadhi mahali alipotaka kwenda kwenye sessionStorage
                    sessionStorage.setItem('redirectAfterLogin', '#/new');

                    // 2. Mpe taarifa ya kueleweka ili asichanganyike
                    alert('Tafadhali ingia kwenye akaunti yako kwanza ili uweze kuweka post.');

                    // 3. Mpeleke kwenye login
                    window.location.hash = '#/login';
                }
            } catch (err) {
                console.error('Auth guard error:', err);
                sessionStorage.setItem('redirectAfterLogin', '#/new');
                window.location.hash = '#/login';
            }
        }
    });
}