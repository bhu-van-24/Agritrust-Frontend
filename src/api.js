import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const farmerService = {
  register: (data) => api.post('/farmers/register', data),
  getAll: () => api.get('/farmers'),
  getById: (id) => api.get(`/farmers/${id}`),
};

export const creditService = {
  calculateScore: (farmerId) => api.post(`/credit/calculate/${farmerId}`),
  getScore: (farmerId) => api.get(`/credit/score/${farmerId}`),
  updateDecision: (farmerId, decision) => api.post(`/credit/decision/${farmerId}`, { decision }),
  getAIInsights: (farmerId) => api.get(`/credit/ai-insights/${farmerId}`),
};

export const chatService = {
  askQuestion: (message) => api.post('/chat/ask', { message }),
};

export default api;
