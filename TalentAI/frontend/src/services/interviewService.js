import api from './api';

export const interviewService = {
  async create(payload) {
    const { data } = await api.post('/interviews', payload);
    return data;
  },

  async get(id) {
    const { data } = await api.get(`/interviews/${id}`);
    return data;
  },

  async submitAnswer(id, payload) {
    const { data } = await api.patch(`/interviews/${id}/answer`, payload);
    return data;
  },

  async finish(id) {
    const { data } = await api.post(`/interviews/${id}/finish`);
    return data;
  },

  async getResult(id) {
    const { data } = await api.get(`/interviews/${id}/result`);
    return data;
  },

  async downloadReport(id) {
    const response = await api.get(`/interviews/${id}/report`, { responseType: 'blob' });
    return response.data;
  },
};
