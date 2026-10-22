/**
 * MICHONGO - Main Entry Point
 */
import { initRouter } from './router.js';

document.addEventListener('DOMContentLoaded', async () => {
  
  // 1. Dhibiti Hamburger Menu ya Simu (Slide-in kutoka kushoto)
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });

    // Ficha menu kiotomatiki mtumiaji akibonyeza link yoyote ya kwenye simu
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
      });
    });

    // Ficha menu pia iwapo mtumiaji atabonyeza sehemu yoyote nje ya menu hiyo
    document.addEventListener('click', (e) => {
      if (!mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
        mobileMenu.classList.remove('open');
      }
    });
  }

  // 2. Anzisha Router ili kurasa ziweze kujichora na kubadilika
  await initRouter();
  
});