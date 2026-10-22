/**
 * MICHONGO - Feed View (Clean & Modular)
 */
import { postsAPI } from '../api/posts.js';
import { renderCommentsSection, attachCommentEvents } from '../components/commentfeed.js';

export async function renderFeedView() {
  return `
    <div class="feed-container" style="display: flex; flex-direction: column; gap: var(--space-4);">
      <div id="feed-loading" style="text-align: center; padding: var(--space-6); color: var(--color-text-muted); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;">
        <!-- Hapa ndipo spinner inapowekwa -->
        <span class="spinner"></span>
        <span>Inapakia michongo...</span>
      </div>
      <div id="feed-error" style="background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; padding: var(--space-3); border-radius: var(--radius-md); text-align: center; display: none;"></div>
      <div id="posts-list" style="display: flex; flex-direction: column; gap: var(--space-4);"></div>
    </div>
  `;
}

export async function attachFeedEvents() {
  // Anzisha pia kusikiliza matukio ya comments
  attachCommentEvents();

  const loadingEl = document.getElementById('feed-loading');
  const errorEl = document.getElementById('feed-error');
  const postsListEl = document.getElementById('posts-list');

  if (!postsListEl) return;

  try {
    const res = await postsAPI.getPosts();

    // Data zikishakuja, tunaficha kabisa lile boksi la loading
    if (loadingEl) loadingEl.style.display = 'none';

    if (res.success && res.posts) {
      if (res.posts.length === 0) {
        postsListEl.innerHTML = `
          <p style="text-align: center; color: var(--color-text-muted); padding: var(--space-6) 0;">
            Hakuna mchongo uliowekwa bado. Kuwa wa kwanza kuweka!
          </p>
        `;
        return;
      }

      postsListEl.innerHTML = res.posts.map(post => renderPostCard(post)).join('');
    } else {
      if (errorEl) {
        errorEl.textContent = res.error || "Imeshindikana kuleta michongo.";
        errorEl.style.display = 'block';
      }
    }
  } catch (err) {
    if (loadingEl) loadingEl.style.display = 'none';
    if (errorEl) {
      errorEl.textContent = "Kuna tatizo la mtandao au server.";
      errorEl.style.display = 'block';
    }
  }
}

function renderPostCard(post) {
  const dateStr = post.created_at ? new Date(post.created_at).toLocaleDateString('sw-TZ', { month: 'short', day: 'numeric' }) : '';
  
  return `
    <article class="post-card" style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-3);">
      
      ${post.is_pinned ? `
        <div style="font-size: 0.75rem; font-weight: 700; color: var(--color-accent); text-transform: uppercase;">
          📌 Mchongo Uliopachikwa Juu
        </div>
      ` : ''}

      <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.875rem; color: var(--color-text-muted);">
        <span style="font-weight: 600; color: var(--color-text);">@${post.username}</span>
        <span>${dateStr}</span>
      </div>

      <div>
        <h3 style="font-size: 1.125rem; font-weight: 700; color: var(--color-text); margin-bottom: var(--space-1);">${post.title}</h3>
        <p style="font-size: 0.9375rem; color: var(--color-text); line-height: 1.5; white-space: pre-line;">${post.content}</p>
      </div>

      ${post.image_url ? `
        <div style="border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--color-border); max-height: 300px;">
          <img src="${post.image_url}" alt="${post.title}" style="width: 100%; height: 100%; object-fit: cover; display: block;" loading="lazy">
        </div>
      ` : ''}

      <!-- Footer ya Kadi (Category + Views + Kitufe cha Comment) -->
      <div style="display: flex; justify-content: space-between; align-items: center; padding-top: var(--space-2); border-top: 1px solid var(--color-border); font-size: 0.8125rem; color: var(--color-text-muted);">
        <span>${post.category ? `🏷️ ${post.category}` : 'Kawaida'}</span>
        
        <div style="display: flex; align-items: center; gap: var(--space-4);">
          <span>👁️ ${post.views_count || 0} views</span>
          <button class="comment-toggle-btn" data-post-id="${post.id}" style="background: none; border: none; color: var(--color-accent); font-weight: 600; cursor: pointer; font-size: 0.8125rem;">💬 Comments</button>
        </div>
      </div>

      <!-- Sehemu ya Comments (Imejificha mpaka user abonyeze Comments) -->
      <div id="comments-section-${post.id}" style="display: none;">
        ${renderCommentsSection(post.id)}
      </div>

    </article>
  `;
}