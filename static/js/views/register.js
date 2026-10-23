/**
 * MICHONGO - Register View
 */
import { authAPI } from '../api/auth.js';
import { store } from '../store.js';
import { checkAndUpdateNav } from '../utils/auth-check.js'; 

export function renderRegisterView() {
  return `
    <div style="display: flex; justify-content: center; align-items: center; padding: var(--space-4); min-height: 70vh;">
      <div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-6); width: 100%; max-width: 400px; box-shadow: var(--shadow-float);">
        
        <h2 style="font-size: 1.5rem; font-weight: 700; color: var(--color-text); margin-bottom: var(--space-2); text-align: center;">Fungua Akaunti</h2>
        <p style="font-size: 0.875rem; color: var(--color-text-muted); text-align: center; margin-bottom: var(--space-5);">Jiunge na MICHONGO upate fursa.</p>
        
        <form id="register-form" style="display: flex; flex-direction: column; gap: var(--space-3);">
          <div id="register-error" style="background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; padding: var(--space-3); border-radius: var(--radius-md); font-size: 0.875rem; text-align: center; display: none;"></div>

          <div style="display: flex; flex-direction: column; gap: var(--space-1);">
            <label for="reg-username" style="font-size: 0.875rem; font-weight: 600; color: var(--color-text);">Username</label>
            <input type="text" id="reg-username" name="username" required placeholder="Chagua username" style="height: 2.75rem; padding: 0 var(--space-3); border: 1px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-bg); color: var(--color-text); outline: none;">
          </div>

          <div style="display: flex; flex-direction: column; gap: var(--space-1);">
            <label for="reg-email" style="font-size: 0.875rem; font-weight: 600; color: var(--color-text);">Email</label>
            <input type="email" id="reg-email" name="email" required placeholder="Weka email yako" style="height: 2.75rem; padding: 0 var(--space-3); border: 1px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-bg); color: var(--color-text); outline: none;">
          </div>

          <div style="display: flex; flex-direction: column; gap: var(--space-1);">
            <label for="reg-password" style="font-size: 0.875rem; font-weight: 600; color: var(--color-text);">Neno la Siri</label>
            <input type="password" id="reg-password" name="password" required placeholder="Weka password thabiti" style="height: 2.75rem; padding: 0 var(--space-3); border: 1px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-bg); color: var(--color-text); outline: none;">
          </div>

          <div style="display: flex; flex-direction: column; gap: var(--space-1);">
            <label for="reg-confirm-password" style="font-size: 0.875rem; font-weight: 600; color: var(--color-text);">Rudinia Neno la Siri</label>
            <input type="password" id="reg-confirm-password" name="confirm_password" required placeholder="Rudia password" style="height: 2.75rem; padding: 0 var(--space-3); border: 1px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-bg); color: var(--color-text); outline: none;">
          </div>

          <button type="submit" id="reg-submit-btn" style="height: 3rem; background: var(--color-accent); color: var(--color-accent-contrast); border: none; border-radius: var(--radius-md); font-weight: 600; cursor: pointer; margin-top: var(--space-2);">Jisajili</button>
        </form>

        <p style="text-align: center; font-size: 0.875rem; color: var(--color-text-muted); margin-top: var(--space-5);">
          Una akaunti tayari? <a href="#/login" style="color: var(--color-accent); font-weight: 600;">Ingia hapa</a>
        </p>
      </div>
    </div>
  `;
}

export function attachRegisterEvents() {
  const form = document.getElementById('register-form');
  const errorBox = document.getElementById('register-error');
  const submitBtn = document.getElementById('reg-submit-btn');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorBox.style.display = 'none';

    const username = document.getElementById('reg-username').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;

    if (!username || !email || !password || !confirmPassword) {
      errorBox.textContent = "Tafadhali jaza sehemu zote.";
      errorBox.style.display = 'block';
      return;
    }

    if (password !== confirmPassword) {
      errorBox.textContent = "Maneno ya siri hayafanani.";
      errorBox.style.display = 'block';
      return;
    }

    submitBtn.textContent = "Inajisajili...";
    submitBtn.disabled = true;

    const result = await authAPI.register(username, email, password, confirmPassword);

    if (result.success) {
      store.setState({ isAuthenticated: true, currentUser: result.user });
      await checkAndUpdateNav()

      window.location.hash = '#/';
    } else {
      errorBox.textContent = result.error || "Imeshindikana kusajili.";
      errorBox.style.display = 'block';
      submitBtn.textContent = "Jisajili";
      submitBtn.disabled = false;
    }
  });
}