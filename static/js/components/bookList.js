import { renderBookCard } from './bookCard.js';

/**
 * Inapokea orodha ya vitabu na kuvichora ndani ya container husika.
 */
export function displayBooks(booksArray, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (!booksArray || booksArray.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--color-text-muted, #64748b);">
                <p style="font-size: 0.95rem; font-weight: 500; margin: 0;">Samahani, hakuna vitabu vilivyopatikana kwa sasa.</p>
            </div>
        `;
        return;
    }

    // Inapangilia kadi zote kwa mpigo na kuzitumbukiza kwenye container
    container.innerHTML = booksArray.map(book => renderBookCard(book)).join('');
}