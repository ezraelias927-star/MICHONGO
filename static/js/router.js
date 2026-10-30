/**
 * MICHONGO - Router (Safe & Clean)
 */
import { renderLoginView, attachLoginEvents } from './views/login.js';
import { renderRegisterView, attachRegisterEvents } from './views/register.js';
import { renderFeedView, attachFeedEvents } from './views/feed.js';
import { renderNewPostView, attachNewPostEvents } from './views/newpost.js';
import { renderAboutView, attachAboutEvents } from './views/about.js';
// 1. Ingiza view/component ya maktaba ya vitabu
import { renderBooksView, attachBooksEvents } from './views/booksView.js';


const routes = {
  '/': {
    render: renderFeedView,
    attach: attachFeedEvents
  },
  '/login': {
    render: renderLoginView,
    attach: attachLoginEvents
  },
  '/register': {
    render: renderRegisterView,
    attach: attachRegisterEvents
  },
  '/new': {
    render: renderNewPostView,    
    attach: attachNewPostEvents    
  },
  '/about': {
    render: renderAboutView,
    attach: attachAboutEvents
  },
  // 2. Ongeza route mpya ya vitabu hapa!
  '/books': {
    render: renderBooksView,
    attach: attachBooksEvents
  }
};

export async function initRouter() {
  const mainView = document.getElementById('view');
  if (!mainView) return;

  async function render() {
    // Pata path ya sasa kwenye hash (mfano #/ au bila hash)
    const path = window.location.hash.replace('#', '') || '/';
    const route = routes[path] || routes['/'];
    
    if (route) {
      try {
        // 1. Weka HTML kwenye ukurasa
        mainView.innerHTML = await route.render();
        
        // 2. Ikiwa kuna function ya kuambatisha matukio/fetch, iite hapa
        if (route.attach) {
          await route.attach();
        }
      } catch (err) {
        console.error("Hitilafu wakati wa kuchora ukurasa:", err);
        mainView.innerHTML = `<div style="padding: var(--space-4); text-align: center; color: #dc2626;">Kuna tatizo limetokea wakati wa kupakia ukurasa huu.</div>`;
      }
    }
  }

  // Sikiliza mabadiliko ya hash kwenye URL
  window.addEventListener('hashchange', render);
  
  // Tekeleza render mara ya kwanza ukurasa unapofunguliwa
  await render();
}