/**
 * MICHONGO - Global State Store
 * Simple reactive state container for the SPA.
 */

class AppStore {
  constructor() {
    this.state = {
      currentUser: null,   // Taarifa za mtumiaji aliyelogin (id, username, email)
      isAuthenticated: false,
      posts: [],           // Orodha ya michongo iliyochotwa
      currentPage: 1,
      hasMorePosts: true
    };
    this.listeners = [];
  }

  // Pata state ya sasa
  getState() {
    return this.state;
  }

  // Sasisha state na kuwatahadharisha wasikilizaji (listeners)
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.notify();
  }

  // Kusajili listeners za mabadiliko ya state
  subscribe(listener) {
    this.listeners.push(listener);
    // Rudisha kitendakazi cha kuondoa subscription
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Kutaarifu components zote kuwa state imebadilika
  notify() {
    this.listeners.forEach(listener => listener(this.state));
  }
}

// Tunatengeneza instance moja tu (Singleton) ya kutumika nchi nzima kwenye app
export const store = new AppStore();