import api from './api';

export const resumeService = {
  async upload(file, onUploadProgress) {
    const formData = new FormData();
    formData.append('resume', file);

    const { data } = await api.post('/resume/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (event) => {
        if (onUploadProgress && event.total) {
          onUploadProgress(Math.round((event.loaded / event.total) * 100));
        }
      },
    });

    return data;
  },

  async getMine() {
    const { data } = await api.get('/resume');
    return data;
  },
};
