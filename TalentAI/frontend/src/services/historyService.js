import api from './api';

export const historyService = {
  async getHistory({ search, difficulty, sortBy, order } = {}) {
    const { data } = await api.get('/history', {
      params: { search, difficulty, sortBy, order },
    });
    return data;
  },

  async deleteEntry(id) {
    const { data } = await api.delete(`/history/${id}`);
    return data;
  },
};
