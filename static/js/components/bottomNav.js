/**
 * MICHONGO - Bottom Navigation Component
 */
import { store } from '../store.js';
import { authAPI } from '../api/auth.js';

export function renderBottomNav() {
  const navContainer = document.getElementById('bottom-nav');
  if (!navContainer) return;

  // Wasiliana na store au kagua uthibitisho
  store.subscribe((state) => {
    const { isAuthenticated, currentUser } = state;

    if (isAuthenticated && currentUser) {
      // Badilisha Login/Register na Profile/Logout
      navContainer.innerHTML = `
        <a class="bottom-nav__item" href="#/profile" data-route="profile">
          <svg class="icon" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span>${currentUser.username}</span>
        </a>
        <a class="bottom-nav__item bottom-nav__item--cta" href="#/new" data-route="new">
          <svg class="icon" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          <span>Post Mpya</span>
        </a>
        <button id="logout-btn" class="bottom-nav__item" type="button">
          <svg class="icon" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          <span>Toka</span>
        </button>
      `;

      // Event listener ya logout
      document.getElementById('logout-btn')?.addEventListener('click', async () => {
        await authAPI.logout();
        store.setState({ isAuthenticated: false, currentUser: null });
        window.location.hash = '#/login';
      });
    }
  });
}