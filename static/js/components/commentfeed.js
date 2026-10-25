/**
 * MICHONGO - Clean & Top-Tier Comment Feed Component
 */
import { commentsAPI } from '../api/comments.js';

/**
 * Inarudisha muundo wa Mfumo wa Comments uliorahisishwa zaidi (UX-Friendly)
 */
export function renderCommentsSection(postId) {
  return `
    <div class="comments-wrapper" style="margin-top: var(--space-3); border-top: 1px solid var(--color-border); padding-top: var(--space-3); background: var(--color-bg); padding: var(--space-3); border-radius: var(--radius-md); position: relative;">
      
      <!-- 1. HEADER & CLOSE BUTTON -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-3); border-bottom: 1px solid var(--color-border); padding-bottom: var(--space-2);">
        <span style="font-weight: 700; font-size: 0.875rem; color: var(--color-text);">💬 Maoni na Michango</span>
        <button 
          type="button" 
          class="comment-toggle-btn" 
          data-post-id="${postId}" 
          style="background: none; border: none; color: #dc2626; font-weight: 700; font-size: 0.8125rem; cursor: pointer; display: flex; align-items: center; gap: 4px;"
        >
          ✖️ Funga
        </button>
      </div>

      <!-- 2. MAIN COMMENT INPUT (CLEAR & VISIBLE) -->
      <div style="display: flex; flex-direction: column; gap: var(--space-2); margin-bottom: var(--space-4);">
        <textarea 
          id="comment-input-${postId}-main" 
          placeholder="Andika maoni au mchongo wako hapa..." 
          rows="2"
          style="width: 100%; padding: var(--space-2) var(--space-3); border: 1.5px solid var(--color-border); border-radius: var(--radius-md); font-size: 0.875rem; background: var(--color-surface); color: var(--color-text); outline: none; resize: none;"
        ></textarea>
        <div style="display: flex; justify-content: flex-end;">
          <button 
            type="button" 
            class="submit-comment-btn" 
            data-post-id="${postId}" 
            style="background: var(--color-accent); color: var(--color-accent-contrast); border: none; padding: var(--space-2) var(--space-4); border-radius: var(--radius-md); font-weight: 700; font-size: 0.8125rem; cursor: pointer;"
          >
            Tuma Maoni 🚀
          </button>
        </div>
      </div>

      <!-- 3. COMMENTS LIST -->
      <div id="comments-list-${postId}" style="display: flex; flex-direction: column; gap: var(--space-3);">
        <p style="font-size: 0.8125rem; color: var(--color-text-muted); text-align: center;">Inapakia maoni...</p>
      </div>

    </div>
  `;
}

/**
 * Event Listeners za Comments & Replies
 */

export function attachCommentEvents() {
  // Ondoa listener ya zamani kwanza kama ilikuwepo ili kuzuia duplicate execution
  document.removeEventListener('click', handleGlobalClick);
  document.addEventListener('click', handleGlobalClick);
}

async function handleGlobalClick(e) {
  // A. Kufungua / Kufunga Comments Section
  if (e.target.classList.contains('comment-toggle-btn')) {
    e.preventDefault();
    const postId = e.target.dataset.postId;
    const section = document.getElementById(`comments-section-${postId}`);
    
    if (section) {
      const isHidden = section.style.display === 'none' || !section.style.display;
      section.style.display = isHidden ? 'block' : 'none';
      if (isHidden) {
        await loadAndRenderComments(postId);
      }
    }
  }

  // B. Kutuma Comment mpya au Reply
  if (e.target.classList.contains('submit-comment-btn')) {
    e.preventDefault();
    const postId = e.target.dataset.postId;
    const parentId = e.target.dataset.parentId || null;
    
    const inputId = parentId ? `comment-input-${postId}-${parentId}` : `comment-input-${postId}-main`;
    const inputEl = document.getElementById(inputId);
    
    if (!inputEl) return;
    const content = inputEl.value.trim();

    if (!content) return;

    // Badilisha maandishi ya kitufe kuwa yanatuma
    const originalText = e.target.textContent;
    e.target.textContent = "Inatuma...";
    e.target.disabled = true;

    try {
      const res = await commentsAPI.addComment(postId, content, parentId);
      
      e.target.textContent = originalText;
      e.target.disabled = false;

      if (res && res.success) {
        inputEl.value = '';
        await loadAndRenderComments(postId);
      } else {
        alert((res && res.error) || "Imeshindikana kutuma maoni.");
      }
    } catch (err) {
      console.error("Hitilafu ya kutuma comment:", err);
      e.target.textContent = originalText;
      e.target.disabled = false;
      alert("Hitilafu ya mtandao. Jaribu tena.");
    }
  }

  // C. Onyesha / Ficha Form ya Reply chini ya comment ya mtu
  if (e.target.classList.contains('reply-toggle-btn')) {
    e.preventDefault();
    const commentId = e.target.dataset.commentId;
    const replyBox = document.getElementById(`reply-box-${commentId}`);
    if (replyBox) {
      const isHidden = replyBox.style.display === 'none' || !replyBox.style.display;
      replyBox.style.display = isHidden ? 'flex' : 'none';
    }
  }
}

/**
 * Pakia na Chora Orodha ya Comments kutoka Backend
 */
async function loadAndRenderComments(postId) {
  const container = document.getElementById(`comments-list-${postId}`);
  if (!container) return;

  const res = await commentsAPI.getComments(postId);
  if (res.success) {
    if (res.comments.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: var(--space-3); color: var(--color-text-muted); font-size: 0.8125rem;">
          Hakuna maoni kwenye mchongo huu bado. Kuwa wa kwanza kuandika!
        </div>
      `;
      return;
    }

    container.innerHTML = res.comments.map(c => renderCommentItem(postId, c)).join('');
  } else {
    container.innerHTML = `
      <div style="text-align: center; padding: var(--space-2); color: #dc2626; font-size: 0.8125rem;">
        Imeshindikana kupakia maoni. Jaribu kutoa au ku-refresh.
      </div>
    `;
  }
}

/**
 * Chora Comment Moja na Majibu (Replies) Yote
 */
function renderCommentItem(postId, comment) {
  const dateStr = comment.created_at ? new Date(comment.created_at).toLocaleDateString('sw-TZ', { month: 'short', day: 'numeric' }) : '';

  return `
    <div class="comment-card" style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-3); font-size: 0.875rem;">
      
      <!-- Comment Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-1);">
        <span style="font-weight: 700; color: var(--color-text);">@${comment.username}</span>
        <span style="font-size: 0.75rem; color: var(--color-text-muted);">${dateStr}</span>
      </div>

      <!-- Comment Content -->
      <p style="color: var(--color-text); line-height: 1.4; margin-bottom: var(--space-2); white-space: pre-line;">${comment.content}</p>

      <!-- Reply Trigger Button -->
      <div style="display: flex; justify-content: flex-end;">
        <button 
          type="button" 
          class="reply-toggle-btn" 
          data-comment-id="${comment.id}" 
          style="background: none; border: none; color: var(--color-accent); font-weight: 600; font-size: 0.75rem; cursor: pointer;"
        >
          ↩️ Jibu @${comment.username}
        </button>
      </div>

      <!-- Threaded Replies Container (Ikiwa zipo) -->
      ${comment.replies && comment.replies.length > 0 ? `
        <div style="margin-top: var(--space-2); padding-left: var(--space-3); border-left: 3px solid var(--color-accent); display: flex; flex-direction: column; gap: var(--space-2);">
          ${comment.replies.map(r => `
            <div style="background: var(--color-bg); padding: var(--space-2) var(--space-3); border-radius: var(--radius-md); border: 1px solid var(--color-border);">
              <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                <span style="font-weight: 700; font-size: 0.75rem; color: var(--color-text);">@${r.username}</span>
                <span style="font-size: 0.7rem; color: var(--color-text-muted);">Jibu</span>
              </div>
              <p style="font-size: 0.8125rem; color: var(--color-text); margin: 0; line-height: 1.3;">${r.content}</p>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- Hidden Input Box for Reply -->
      <div id="reply-box-${comment.id}" style="display: none; flex-direction: column; gap: var(--space-2); margin-top: var(--space-3); padding-top: var(--space-2); border-top: 1px dashed var(--color-border);">
        <input 
          type="text" 
          id="comment-input-${postId}-${comment.id}" 
          placeholder="Andika jibu lako kwa @${comment.username}..." 
          style="width: 100%; height: 2.2rem; padding: 0 var(--space-3); border: 1px solid var(--color-border); border-radius: var(--radius-md); font-size: 0.8125rem; background: var(--color-bg); outline: none;"
        >
        <div style="display: flex; justify-content: flex-end; gap: var(--space-2);">
          <button 
            type="button" 
            class="submit-comment-btn" 
            data-post-id="${postId}" 
            data-parent-id="${comment.id}" 
            style="background: var(--color-accent); color: var(--color-accent-contrast); border: none; padding: 0.3rem var(--space-3); border-radius: var(--radius-md); font-size: 0.75rem; font-weight: 700; cursor: pointer;"
          >
            Tuma Jibu
          </button>
        </div>
      </div>

    </div>
  `;
}