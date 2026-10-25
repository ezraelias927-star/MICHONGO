import { postsAPI } from '../api/posts.js';
import { renderCommentsSection, attachCommentEvents } from '../components/commentfeed.js';

export async function renderFeedView() {
  return `
    <div class="feed-container" style="display:flex; flex-direction:column; gap:var(--space-4);">
      <div id="posts-list" style="display:flex; flex-direction:column; gap:var(--space-4);"></div>
      <div id="loading-container" style="text-align:center; padding:var(--space-4);">
        <span id="load-spinner" class="spinner" style="display:inline-block; width:24px; height:24px;"></span>
      </div>
    </div>
  `;
}

export async function attachFeedEvents() {
  attachCommentEvents();
  document.getElementById('posts-list').innerHTML = '';
  
  const spinner = document.getElementById('load-spinner');
  const container = document.getElementById('loading-container');
  if (spinner) spinner.style.display = 'inline-block';

  try {
    // Tunavuta zote bila kugawanya kwa page
    const res = await postsAPI.getPosts();
    
    // Angalia kama data zimerudi vizuri (inategemea kama backend inarudisha array ya posts moja kwa moja au ndani ya object)
    const posts = Array.isArray(res) ? res : (res.posts || []);
    
    if (posts.length > 0) {
      const html = posts.map(p => renderCard(p)).join('');
      document.getElementById('posts-list').innerHTML = html;
    }
  } catch (err) {
    console.error(err);
  } finally {
    if (container) container.style.display = 'none';
  }
}

function renderCard(p) {
  return `
    <article class="post-card" style="background:var(--color-surface); border:1px solid var(--color-border); border-radius:var(--radius-md); padding:var(--space-4); display:flex; flex-direction:column; gap:var(--space-3);">
      <div style="display:flex; justify-content:space-between; font-size:0.875rem; color:var(--color-text-muted);">
        <span style="font-weight:600; color:var(--color-text);">@${p.username}</span>
        <span>${p.created_at ? new Date(p.created_at).toLocaleDateString('sw-TZ', { month:'short', day:'numeric' }) : ''}</span>
      </div>
      <div>
        <h3 style="font-size:1.125rem; font-weight:700; color:var(--color-text); margin-bottom:var(--space-1);">${p.title}</h3>
        <p style="font-size:0.9375rem; color:var(--color-text); line-height:1.5;">${p.content}</p>
      </div>
      ${p.image_url ? `<div style="border-radius:var(--radius-md); overflow:hidden; max-height:300px;"><img src="${p.image_url}" style="width:100%; height:100%; object-fit:cover;"></div>` : ''}
      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--color-border); padding-top:var(--space-2); font-size:0.8125rem; color:var(--color-text-muted);">
        <span>🏷️ ${p.category || 'Kawaida'}</span>
        <div style="display:flex; gap:var(--space-4);">
          <span>👁️ ${p.views_count || 0}</span>
          <button class="comment-toggle-btn" data-post-id="${p.id}" style="background:none; border:none; color:var(--color-accent); font-weight:600; cursor:pointer;">💬 Comments</button>
        </div>
      </div>
      <div id="comments-section-${p.id}" style="display:none;">${renderCommentsSection(p.id)}</div>
    </article>
  `;
}