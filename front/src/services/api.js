import axios from 'axios';

// Detectar se está sendo acessado via ngrok e usar proxy
const isNgrok = window.location.hostname.includes('ngrok-free.app');
const API_BASE_URL = isNgrok
  ? '' // Usar proxy quando via ngrok
  : 'http://localhost:3001'; // Sempre usar porta 3001 em desenvolvimento local

console.log('🌐 Ambiente detectado:', { 
  isNgrok, 
  hostname: window.location.hostname, 
  API_BASE_URL,
  willUseProxy: isNgrok
});

// Instância do axios com configurações base
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token às requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido ou expirado - apenas quando não estiver na página de login
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Serviços de autenticação
export const authAPI = {
  // Registrar novo usuário
  register: async (email, password) => {
    const response = await api.post('/auth/register', { email, password });
    return response.data;
  },

  // Login do usuário
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // Obter dados do usuário atual
  me: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Logout do usuário
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Renovar token
  refreshToken: async () => {
    const response = await api.post('/auth/refresh-token');
    return response.data;
  },

  // Atualizar nome do usuário
  updateName: async (name) => {
    const response = await api.put('/auth/update-name', { name });
    return response.data;
  },

  // Excluir conta
  deleteAccount: async () => {
    const response = await api.delete('/auth/delete-account');
    return response.data;
  },
};

// Serviços para estudantes
export const studentAPI = {
  // Obter todos os estudantes
  getStudents: async () => {
    const response = await api.get('/students');
    return response.data;
  },

  // Obter um estudante específico
  getStudent: async (id) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },

  // Criar novo estudante
  createStudent: async (studentData) => {
    const response = await api.post('/students', studentData);
    return response.data;
  },

  // Atualizar estudante
  updateStudent: async (id, studentData) => {
    const response = await api.put(`/students/${id}`, studentData);
    return response.data;
  },

  // Deletar estudante
  deleteStudent: async (id) => {
    const response = await api.delete(`/students/${id}`);
    return response.data;
  },

  // Upload de laudo médico
  uploadLaudo: async (studentId, formData) => {
    const response = await api.post(`/students/${studentId}/upload-laudo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Download de laudo médico
  downloadLaudo: async (studentId) => {
    const response = await api.get(`/students/${studentId}/download-laudo`, {
      responseType: 'blob', // Para download de arquivos
    });
    return response;
  },

  // Remover laudo médico
  removeLaudo: async (studentId) => {
    const response = await api.delete(`/students/${studentId}/remove-laudo`);
    return response.data;
  },

  // Upload de atividade para adaptação
  uploadActivity: async (studentId, formData) => {
    const response = await api.post(`/students/${studentId}/upload-activity`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  // Verificar status da adaptação de atividade
  getActivityStatus: async (studentId) => {
    const response = await api.get(`/students/${studentId}/activity-status`);
    return response.data;
  },

  // Obter estatísticas de armazenamento
  getStorageStats: async () => {
    const response = await api.get('/students/admin/storage-stats');
    return response.data;
  },
};

export default api;