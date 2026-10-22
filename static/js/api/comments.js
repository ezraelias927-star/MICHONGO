/**
 * MICHONGO - Comments API
 */
import { apiRequest } from './client.js';

export const commentsAPI = {
  async getComments(postId) {
    return await apiRequest(`/posts/${postId}/comments`, 'GET');
  },

  async addComment(postId, content, parentId = null) {
    return await apiRequest(`/posts/${postId}/comments`, 'POST', {
      content,
      parent_id: parentId
    });
  }
};