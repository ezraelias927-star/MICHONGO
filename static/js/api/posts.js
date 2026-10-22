/**
 * MICHONGO - Posts API
 */
import { apiRequest } from './client.js';

export const postsAPI = {
  async getPosts() {
    return await apiRequest('/posts/', 'GET');
  },

  async createPost(formData) {
    // KUMBUKA: Hapa tunatumia fetch ya moja kwa moja au apiRequest kwa sababu ya FormData (Faili la picha)
    const response = await fetch('/posts/create', {
      method: 'POST',
      body: formData,
      credentials: 'same-origin'
    });
    return await response.json();
  }
};