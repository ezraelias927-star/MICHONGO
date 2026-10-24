/**
 * MICHONGO - Feed View (Imesanifiwa na Circular Endless Scroll & Intersection Observer)
 */
import { postsAPI } from '../api/posts.js';
import { renderCommentsSection, attachCommentEvents } from '../components/commentfeed.js';

// Global state kwa ajili ya pagination na ufuatiliaji wa scroll
let currentPage = 1;
let isLoading = false;
let observer = null;
const LIMIT = 5; // Idadi ya post kwa kila batch (unaweza kuongeza kama 10)

export async function renderFeedView() {
  // Tunarejesha muundo safi wa HTML na kuweka Sentinel (kichochezi cha kusoma chini)
  return `
    <div class="feed-container" style="display: flex; flex-direction: column; gap: var(--space-4);">
      <div id="feed-loading" style="text-align: center; padding: var(--space-6); color: var(--color-text-muted); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;">
        <span class="spinner"></span>
        <span>Inapakia michongo...</span>
      </div>
      
      <div id="feed-error" style="background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; padding: var(--space-3); border-radius: var(--radius-md); text-align: center; display: none;"></div>
      
      <!-- Hapa ndipo posts zote zitakapokuwa zinajipanga -->
      <div id="posts-list" style="display: flex; flex-direction: column; gap: var(--space-4);"></div>

      <!-- Kichochezi cha mwisho (Sentinel element kwa ajili ya Intersection Observer) -->
      <div id="scroll-sentinel" style="height: 20px; width: 100%; display: flex; justify-content: center; align-items: center; padding: var(--space-4);">
        <span id="load-more-spinner" class="spinner" style="display: none; width: 20px; height: 20px;"></span>
      </div>
    </div>
  `;
}

export async function attachFeedEvents() {
  // Anzisha kusikiliza matukio ya comments
  attachCommentEvents();

  const postsListEl = document.getElementById('posts-list');
  const loadingEl = document.getElementById('feed-loading');
  const errorEl = document.getElementById('feed-error');
  const sentinelEl = document.getElementById('scroll-sentinel');

  if (!postsListEl) return;

  // Weka state ya mwanzo safi kila ukurasa unapofunguliwa
  currentPage = 1;
  isLoading = false;
  postsListEl.innerHTML = '';

  // 1. Pakia batch ya kwanza
  await fetchAndAppendPosts(true);

  // 2. Weka Intersection Observer kusikiliza mtumiaji anaposhuka chini
  if (sentinelEl) {
    if (observer) observer.disconnect(); // Zuia observer za zamani zisogongeane

    observer = new IntersectionObserver(async (entries) => {
      const target = entries[0];
      if (target.isIntersecting && !isLoading) {
        await fetchAndAppendPosts(false);
      }
    }, {
      root: null,
      rootMargin: '200px', // Anza kupakia kabla hajafika mwisho kabisa kwa pixel 200
      threshold: 0.1
    });

    observer.observe(sentinelEl);
  }
}

/**
 * Kazi maalum ya kuvuta post na kuzichora kwenye DOM
 * @param {boolean} isInitial - Kama ni mara ya kwanza kufunguka au la
 */
async function fetchAndAppendPosts(isInitial = false) {
  if (isLoading) return;
  isLoading = true;

  const loadingEl = document.getElementById('feed-loading');
  const errorEl = document.getElementById('feed-error');
  const postsListEl = document.getElementById('posts-list');
  const loadMoreSpinner = document.getElementById('load-more-spinner');

  if (isInitial && loadingEl) {
    loadingEl.style.display = 'flex';
  } else if (!isInitial && loadMoreSpinner) {
    loadMoreSpinner.style.display = 'inline-block';
  }

  try {
    // Tunapiga API tukiwa na page na limit
    const res = await postsAPI.getPosts({ page: currentPage, limit: LIMIT });

    if (isInitial && loadingEl) loadingEl.style.display = 'none';
    if (!isInitial && loadMoreSpinner) loadMoreSpinner.style.display = 'none';

    if (res.success && res.posts) {
      if (res.posts.length > 0) {
        // Chora post mpya na uzigandishe chini ya zilizopo (Append)
        const htmlContent = res.posts.map(post => renderPostCard(post)).join('');
        postsListEl.insertAdjacentHTML('beforeend', htmlContent);
        
        // Ongeza page kwa ajili ya awamu ijayo
        currentPage++;
      } else {
        // HAPA NDIPO MZUGO WA MWISHO UNAPOFIKIA (Circular Infinite Loop)
        // Kama data zimeisha kwenye server, tunaweka alama ya mzunguko na kurudisha page = 1
        console.log("Umefika mwisho wa database! Tunarudisha mzunguko mwanzo...");
        
        // Weka kigawanyiko cha kistaarabu kuonyesha kuwa mzunguko umeanza upya
        postsListEl.insertAdjacentHTML('beforeend', `
          <div style="text-align: center; padding: var(--space-4); color: var(--color-text-muted); font-size: 0.8125rem; border-top: 1px dashed var(--color-border); margin: var(--space-2) 0;">
            🔄 Umeanza kuona michongo iliyopita tena (Mzunguko Mpya)
          </div>
        `);

        // Rudisha page iwe 1 ili ianze upya kwenye mzunguko unaofuata
        currentPage = 1;
        
        // Vuta mara moja data za mwanzo ili mtumiaji asilazimike kusubiri tena
        const retryRes = await postsAPI.getPosts({ page: currentPage, limit: LIMIT });
        if (retryRes.success && retryRes.posts && retryRes.posts.length > 0) {
          const retryHtml = retryRes.posts.map(post => renderPostCard(post)).join('');
          postsListEl.insertAdjacentHTML('beforeend', retryHtml);
          currentPage++; // Ijiandae kwa ajili ya page inayofuata
        }
      }
    } else {
      if (errorEl && isInitial) {
        errorEl.textContent = res.error || "Imeshindikana kuleta michongo.";
        errorEl.style.display = 'block';
      }
    }
  } catch (err) {
    console.error('Hitilafu ya endless scroll:', err);
    if (loadingEl) loadingEl.style.display = 'none';
    if (loadMoreSpinner) loadMoreSpinner.style.display = 'none';
    if (errorEl && isInitial) {
      errorEl.textContent = "Kuna tatizo la mtandao au server.";
      errorEl.style.display = 'block';
    }
  } finally {
    isLoading = false;
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