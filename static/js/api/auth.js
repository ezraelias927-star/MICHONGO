/**
 * MICHONGO - Auth API Endpoints
 */
import { apiRequest } from './client.js';

export const authAPI = {
  async checkSession() {
    return await apiRequest('/auth/me', 'GET');
  },

  async login(identifier, password) {
    return await apiRequest('/auth/login', 'POST', { identifier, password });
  },

  async register(username, email, password, confirm_password) {
    return await apiRequest('/auth/register', 'POST', { username, email, password, confirm_password });
  },

  async logout() {
    return await apiRequest('/auth/logout', 'POST');
  }
};