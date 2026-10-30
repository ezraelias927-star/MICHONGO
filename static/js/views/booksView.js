import { displayBooks } from '../components/bookList.js';

// 1. HTML Shell ya ukurasa wa maktaba (Search pekee bila kategoria)
export function renderBooksView() {
    return `
        <div style="max-width: 1000px; margin: 0 auto; padding: var(--space-4, 1.5rem);">
            <!-- Header & Centered Search Section -->
            <div style="text-align: center; margin-bottom: 2.5rem;">
                <h2 style="font-size: 1.75rem; font-weight: 800; color: var(--color-text, #0f172a); margin-bottom: 0.5rem; letter-spacing: -0.5px;">Maktaba ya Vitabu</h2>
                <p style="font-size: 0.95rem; color: var(--color-text-muted, #64748b); margin-bottom: 1.5rem;">Tafuta vitabu mbalimbali vya ujasriamali kama kilimo,ufugaji etc.</p>
                
                <div style="max-width: 600px; margin: 0 auto;">
                    <div style="display: flex; box-shadow: var(--shadow-sm, 0 2px 4px rgba(0,0,0,0.06)); border-radius: var(--radius-lg, 10px); overflow: hidden; border: 1px solid var(--color-border, #cbd5e1); background: var(--color-surface, #ffffff);">
                        <input type="text" id="search-input" placeholder="Andika jina la kitabu au kategoria (mfano: Mathematics, Physics)..." style="flex: 1; padding: 0.75rem 1.25rem; border: none; outline: none; font-size: 1rem; color: var(--color-text, #0f172a); background: transparent;">
                        <button type="button" id="search-btn" style="background: var(--color-primary, #2563eb); color: #ffffff; border: none; padding: 0 1.5rem; font-weight: 600; font-size: 0.95rem; cursor: pointer; transition: background 0.2s ease;">Tafuta</button>
                    </div>
                </div>
            </div>

            <!-- Orodha ya Vitabu (Full Width Grid) -->
            <div>
                <div id="books-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem;">
                    <!-- Kadi za vitabu zitawekwa hapa hapa na JavaScript -->
                </div>
            </div>
        </div>
    `;
}

// 2. Mantiki ya kuchota data na kusikiliza vitufe vya Utafutaji
export async function attachBooksEvents() {
    const booksContainer = document.getElementById('books-container');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    let currentSearchQuery = '';

    // Function kuu ya kuchota vitabu kutoka Backend
    async function fetchBooks() {
        try {
            let url = `/api/books?`;
            if (currentSearchQuery) {
                url += `q=${encodeURIComponent(currentSearchQuery)}`;
            }

            const response = await fetch(url);
            const result = await response.json();

            if (result.success) {
                displayBooks(result.data, 'books-container');
            }
        } catch (error) {
            console.error("Hitilafu kwenye kupata vitabu:", error);
            booksContainer.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; color: #dc2626; padding: 2rem; font-weight: 500;">Imeshindikana kupakia vitabu.</div>`;
        }
    }

    // 3. Tekeleza mwanzo kabisa ukurasa unapofunguliwa (Inaleta vitabu vyote)
    await fetchBooks();

    // 4. Matukio ya Utafutaji (Search Events)
    searchBtn.addEventListener('click', () => {
        currentSearchQuery = searchInput.value.trim();
        fetchBooks();
    });

    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            currentSearchQuery = searchInput.value.trim();
            fetchBooks();
        }
    });
}