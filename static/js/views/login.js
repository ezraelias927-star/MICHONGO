/**
 * MICHONGO - Login View (Imesanifiwa na Smart Redirect & Auto Nav Sync)
 */
import { authAPI } from '../api/auth.js';
import { store } from '../store.js';
import { checkAndUpdateNav } from '../utils/auth-check.js'; 

export function renderLoginView() {
  return `
    <div style="display: flex; justify-content: center; align-items: center; padding: var(--space-4); min-height: 70vh;">
      <div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-6); width: 100%; max-width: 400px; box-shadow: var(--shadow-float);">
        
        <h2 style="font-size: 1.5rem; font-weight: 700; color: var(--color-text); margin-bottom: var(--space-2); text-align: center;">Karibu Tena</h2>
        <p style="font-size: 0.875rem; color: var(--color-text-muted); text-align: center; margin-bottom: var(--space-5);">Ingia kuendelea na michongo.</p>
        
        <form id="login-form" style="display: flex; flex-direction: column; gap: var(--space-4);">
          <div id="login-error" style="background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; padding: var(--space-3); border-radius: var(--radius-md); font-size: 0.875rem; text-align: center; display: none;"></div>

          <div style="display: flex; flex-direction: column; gap: var(--space-1);">
            <label for="identifier" style="font-size: 0.875rem; font-weight: 600; color: var(--color-text);">Username au Email</label>
            <input type="text" id="identifier" name="identifier" required placeholder="Weka username au email" style="height: 3rem; padding: 0 var(--space-3); border: 1px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-bg); color: var(--color-text); outline: none;">
          </div>

          <div style="display: flex; flex-direction: column; gap: var(--space-1);">
            <label for="password" style="font-size: 0.875rem; font-weight: 600; color: var(--color-text);">Neno la Siri</label>
            <input type="password" id="password" name="password" required placeholder="Weka password" style="height: 3rem; padding: 0 var(--space-3); border: 1px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-bg); color: var(--color-text); outline: none;">
          </div>

          <button type="submit" id="login-submit-btn" style="height: 3rem; background: var(--color-accent); color: var(--color-accent-contrast); border: none; border-radius: var(--radius-md); font-weight: 600; cursor: pointer; margin-top: var(--space-2);">Ingia</button>
        </form>

        <p style="text-align: center; font-size: 0.875rem; color: var(--color-text-muted); margin-top: var(--space-5);">
          Hauna akaunti? <a href="#/register" style="color: var(--color-accent); font-weight: 600;">Sajili hapa</a>
        </p>
      </div>
    </div>
  `;
}

export function attachLoginEvents() {
  const form = document.getElementById('login-form');
  const errorBox = document.getElementById('login-error');
  const submitBtn = document.getElementById('login-submit-btn');
  const identifierInput = document.getElementById('identifier');
  const passwordInput = document.getElementById('password');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Safisha makosa ya awali
    errorBox.style.display = 'none';
    errorBox.innerHTML = '';
    identifierInput.style.borderColor = 'var(--color-border)';
    passwordInput.style.borderColor = 'var(--color-border)';

    const identifier = identifierInput.value.trim();
    const password = passwordInput.value;

    if (!identifier || !password) {
      errorBox.textContent = "Tafadhali jaza sehemu zote kabla ya kuendelea.";
      errorBox.style.display = 'block';
      if (!identifier) identifierInput.style.borderColor = '#dc2626';
      if (!password) passwordInput.style.borderColor = '#dc2626';
      return;
    }

    submitBtn.textContent = "Inaingia...";
    submitBtn.disabled = true;

    try {
      const result = await authAPI.login(identifier, password);

      // Kama imerudi na success: false (kama object)
      if (result && result.success === false) {
        throw result;
      }

      // Kama imerudi vizuri kabisa
      if (result && result.success) {
        store.setState({ isAuthenticated: true, currentUser: result.user });

        if (typeof checkAndUpdateNav === 'function') {
          await checkAndUpdateNav();
        }

        const savedRedirect = sessionStorage.getItem('redirectAfterLogin');
        if (savedRedirect) {
          sessionStorage.removeItem('redirectAfterLogin');
          window.location.hash = savedRedirect;
        } else {
          window.location.hash = '#/';
        }
      } else {
        // Kama imerudi bila success true wala false ya kueleweka
        throw { errors: ["Imeshindikana kuingia. Jaribu tena."] };
      }

    } catch (err) {
      console.error('Login error caught:', err);
      
      let errorMessage = "Barua pepe/username au neno la siri si sahihi.";

      if (err) {
        // 1. Kama ni array ya errors (mfano: kutoka Flask json)
        if (Array.isArray(err.errors) && err.errors.length > 0) {
          errorMessage = err.errors.join('<br>');
        } 
        // 2. Kama ni object yenye error string
        else if (typeof err.error === 'string') {
          errorMessage = err.error;
        } 
        // 3. Kama err yenyewe ni string
        else if (typeof err === 'string') {
          errorMessage = err;
        }
        // 4. Kama ni JS Error object (mfano err.message)
        else if (err.message && typeof err.message === 'string' && err.message !== "[object Object]") {
          errorMessage = err.message;
        }
      }

      errorBox.innerHTML = errorMessage;
      errorBox.style.display = 'block';

      identifierInput.style.borderColor = '#dc2626';
      passwordInput.style.borderColor = '#dc2626';

      submitBtn.textContent = "Ingia";
      submitBtn.disabled = false;
    }
  });
}