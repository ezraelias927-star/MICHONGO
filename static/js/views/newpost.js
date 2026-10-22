/**
 * MICHONGO - New Post View
 */
import { postsAPI } from '../api/posts.js';

export async function renderNewPostView() {
  return `
    <div class="new-post-container" style="max-width: 600px; margin: 0 auto; background: var(--color-surface); border: 1.5px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-5);">
      
      <!-- Header na Kitufe cha Kufunga -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4); border-bottom: 1px solid var(--color-border); padding-bottom: var(--space-2);">
        <h2 style="font-size: 1.125rem; font-weight: 700; color: var(--color-text); margin: 0;">Weka Mchongo Mpya</h2>
        <a href="#/" style="text-decoration: none; color: #dc2626; font-weight: 700; font-size: 0.8125rem;">✖️ Funga</a>
      </div>
      
      <!-- Sehemu ya Ujumbe wa Makosa -->
      <div id="new-post-error" style="background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; padding: var(--space-3); border-radius: var(--radius-md); font-size: 0.875rem; margin-bottom: var(--space-4); display: none;"></div>

      <form id="new-post-form" style="display: flex; flex-direction: column; gap: var(--space-4);">
        
        <!-- Kichwa cha Mchongo -->
        <div style="display: flex; flex-direction: column; gap: var(--space-1);">
          <label for="post-title" style="font-weight: 600; font-size: 0.875rem; color: var(--color-text);">Kichwa cha Mchongo</label>
          <input 
            type="text" 
            id="post-title" 
            required 
            placeholder="Mfano: Nafasi ya kazi / Mchongo wa biashara..." 
            style="height: 2.5rem; padding: 0 var(--space-3); border: 1px solid var(--color-border); border-radius: var(--radius-md); font-size: 0.875rem; background: var(--color-bg); color: var(--color-text); outline: none;"
          >
        </div>

        <!-- Kupakia Picha Kutoka Kwenye Simu -->
        <div style="display: flex; flex-direction: column; gap: var(--space-1);">
          <label for="post-image-file" style="font-weight: 600; font-size: 0.875rem; color: var(--color-text);">Weka Picha (Hiari)</label>
          <input 
            type="file" 
            id="post-image-file" 
            accept="image/*" 
            style="padding: var(--space-2); border: 1px solid var(--color-border); border-radius: var(--radius-md); font-size: 0.875rem; background: var(--color-bg); color: var(--color-text);"
          >
        </div>

        <!-- Maelezo Kamili -->
        <div style="display: flex; flex-direction: column; gap: var(--space-1);">
          <label for="post-content" style="font-weight: 600; font-size: 0.875rem; color: var(--color-text);">Maelezo Kamili</label>
          <textarea 
            id="post-content" 
            required 
            rows="5" 
            placeholder="Eleza kwa undani mchongo wako hapa..." 
            style="padding: var(--space-3); border: 1px solid var(--color-border); border-radius: var(--radius-md); font-size: 0.875rem; background: var(--color-bg); color: var(--color-text); outline: none; resize: vertical;"
          ></textarea>
        </div>

        <!-- Kitufe cha Kutuma -->
        <button 
          type="submit" 
          id="submit-post-btn" 
          style="background: var(--color-accent); color: var(--color-accent-contrast); border: none; height: 2.75rem; border-radius: var(--radius-md); font-weight: 700; font-size: 0.9375rem; cursor: pointer;"
        >
          Chapisha Mchongo
        </button>

      </form>
    </div>
  `;
}

export function attachNewPostEvents() {
  const form = document.getElementById('new-post-form');
  const errorEl = document.getElementById('new-post-error');
  const submitBtn = document.getElementById('submit-post-btn');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.style.display = 'none';

    const title = document.getElementById('post-title').value.trim();
    const content = document.getElementById('post-content').value.trim();
    const imageFileInput = document.getElementById('post-image-file');

    if (!title || !content) {
      errorEl.textContent = "Tafadhali jaza kichwa cha mchongo na maelezo.";
      errorEl.style.display = 'block';
      return;
    }

    submitBtn.textContent = "Inachapisha...";
    submitBtn.disabled = true;

    try {
      // Tunatengeneza FormData kuendana na request.form na request.files ya Flask
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);

      if (imageFileInput.files && imageFileInput.files[0]) {
        formData.append('image', imageFileInput.files[0]);
      }

      const res = await postsAPI.createPost(formData);

      if (res.success) {
        window.location.hash = '#/';
      } else {
        // Angalia kama kuna makosa yamerudi kwenye array ya 'errors' kutoka kwenye backend yako
        const errorMsg = res.errors ? res.errors.join(', ') : "Imeshindikana kuchapisha mchongo.";
        errorEl.textContent = errorMsg;
        errorEl.style.display = 'block';
        submitBtn.textContent = "Chapisha Mchongo";
        submitBtn.disabled = false;
      }
    } catch (err) {
      console.error(err);
      errorEl.textContent = "Kuna tatizo la mtandao. Jaribu tena.";
      errorEl.style.display = 'block';
      submitBtn.textContent = "Chapisha Mchongo";
      submitBtn.disabled = false;
    }
  });
}