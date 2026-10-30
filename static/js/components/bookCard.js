/**
 * MICHONGO - Book Card Component
 * Inachukua taarifa za kitabu kimoja na kurudisha HTML safi kulingana na design tokens.
 */
export function renderBookCard(book) {
    return `
        <div class="mchongo-card" style="background: var(--color-surface, #ffffff); border: 1px solid var(--color-border, #e2e8f0); border-radius: var(--radius-lg, 12px); padding: var(--space-4, 1rem); display: flex; flex-direction: column; justify-content: space-between; height: 100%; transition: transform 0.2s ease, box-shadow 0.2s ease;">
            
            <!-- Sehemu ya Juu: Kategoria & Jina la Kitabu -->
            <div>
                <span class="mchongo-badge" style="display: inline-block; background: var(--color-surface-muted, #f1f5f9); color: var(--color-primary, #0f172a); font-size: 0.75rem; font-weight: 600; padding: 0.25rem 0.75rem; border-radius: 50rem; margin-bottom: 0.75rem;">
                    📚 ${book.category_name}
                </span>

                <h3 class="mchongo-title" style="font-size: 1rem; font-weight: 700; color: var(--color-text, #0f172a); line-height: 1.4; margin-bottom: 1rem;">
                    ${book.title}
                </h3>
            </div>

            <!-- Sehemu ya Chini: Kitufe cha Kupakua -->
            <div style="margin-top: auto; padding-top: 0.5rem;">
                <a href="${book.file_url}" 
                   target="_blank" 
                   style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; width: 100%; background: transparent; color: var(--color-primary, #2563eb); border: 1px solid var(--color-primary, #2563eb); padding: 0.6rem 1rem; border-radius: var(--radius-md, 8px); font-size: 0.875rem; font-weight: 600; text-decoration: none; transition: background 0.2s ease, color 0.2s ease;"
                   onmouseover="this.style.background='var(--color-primary)'; this.style.color='#ffffff';"
                   onmouseout="this.style.background='transparent'; this.style.color='var(--color-primary)';">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M7.646 10.854a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 9.293V5.5a.5.5 0 0 0-1 0v3.793L6.354 8.146a.5.5 0 1 0-.708.708z"/>
                        <path d="M4.406 3.342A5.5 5.5 0 0 1 12 2.5a5.45 5.45 0 0 1 5.018 3.21 3.5 3.5 0 0 1 1.082 6.892H15v-1a2.5 2.5 0 0 0-4.832-.832l-.12.392h-.372a2.5 2.5 0 0 0-4.908-.508l-.12-.392a2.5 2.5 0 0 0-4.832.832v1H2.5a3.5 3.5 0 0 1 .906-6.842zm2.062-.317a4.5 4.5 0 0 1 8.064 2.079 2.5 2.5 0 0 1 2.364 2.502 2.5 2.5 0 0 1-2.5 2.5H13v-1a1.5 1.5 0 0 0-3 0v1H5.5a1.5 1.5 0 0 1-1.5-1.5c0-.622.37-1.168.904-1.41l.34-.155.12-.353a1.5 1.5 0 0 1 2.766-.54l.214.33.364.08a2.5 2.5 0 0 0 .393-.058z"/>
                    </svg>
                    Pakua PDF
                </a>
            </div>
        </div>
    `;
}