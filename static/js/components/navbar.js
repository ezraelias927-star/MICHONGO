/**
 * MICHONGO - Classic Navbar Component (Robust Event Delegation)
 */
export function renderNavbar() {
  return `
    <header style="background: var(--color-surface); border-bottom: 1px solid var(--color-border); position: sticky; top: 0; z-index: 1000;">
      <nav style="max-width: 800px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem;">
        
        <!-- Logo / Jina la Mfumo -->
        <a href="#/" style="font-weight: 800; font-size: 1.125rem; color: var(--color-text); text-decoration: none; letter-spacing: -0.5px;">
          MICHONGO
        </a>
        
        <!-- Desktop Navigation Links -->
        <div class="desktop-nav" style="display: flex; gap: 1.5rem; align-items: center;">
          <a href="#/" style="text-decoration: none; color: var(--color-text); font-size: 0.875rem; font-weight: 600;">Tazama Michongo</a>
          <a href="#/new" style="text-decoration: none; color: var(--color-text); font-size: 0.875rem; font-weight: 600;">Weka Mchongo</a>
          <a href="#/about" style="text-decoration: none; color: var(--color-text); font-size: 0.875rem; font-weight: 600;">Kuhusu Sisi</a>
        </div>

        <!-- Hamburger Button -->
        <button 
          type="button" 
          id="hamburger-btn" 
          style="background: none; border: none; font-size: 1.25rem; cursor: pointer; color: var(--color-text); display: none; padding: 4px;"
          aria-label="Menu"
        >
          &#9776;
        </button>
      </nav>

      <!-- Mobile Dropdown Menu -->
      <div id="mobile-menu" style="display: none; flex-direction: column; background: var(--color-surface); border-top: 1px solid var(--color-border); padding: 0.75rem 1rem; gap: 0.5rem;">
        <a href="#/" class="mobile-link" style="text-decoration: none; color: var(--color-text); font-weight: 600; font-size: 0.875rem; padding: 0.5rem 0; border-bottom: 1px solid var(--color-border);">Tazama Michongo</a>
        <a href="#/new" class="mobile-link" style="text-decoration: none; color: var(--color-text); font-weight: 600; font-size: 0.875rem; padding: 0.5rem 0; border-bottom: 1px solid var(--color-border);">Weka Mchongo</a>
        <a href="#/about" class="mobile-link" style="text-decoration: none; color: var(--color-text); font-weight: 600; font-size: 0.875rem; padding: 0.5rem 0;">Kuhusu Sisi</a>
      </div>
    </header>

    <style>
      @media (max-width: 768px) {
        .desktop-nav {
          display: none !important;
        }
        #hamburger-btn {
          display: block !important;
        }
      }
    </style>
  `;
}

export function attachNavbarEvents() {
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isHidden = mobileMenu.style.display === 'none' || !mobileMenu.style.display;
      mobileMenu.style.display = isHidden ? 'flex' : 'none';
    });

    // Ficha menu ikibonyezwa link yoyote
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.style.display = 'none';
      });
    });
  }
}
