// Em: src/api/axiosConfig.js
// VERSÃO DE TESTE FINAL (URL diretamente no baseURL)

import axios from 'axios';

// Pega a URL diretamente da variável de ambiente AQUI
const productionApiUrl = import.meta.env.VITE_API_URL || 'http://fallback-url.com'; // Fallback só para garantir

// ----- DEBUGGING -----
console.log("URL lida para baseURL:", productionApiUrl); 
// ----- FIM DEBUGGING -----

// Cria a instância do axios passando a baseURL completa DIRETAMENTE
const apiClient = axios.create({
  baseURL: `${productionApiUrl}/api`, 
});

// ----- DEBUGGING 2 -----
console.log("Axios baseURL configurada:", apiClient.defaults.baseURL); 
// ----- FIM DEBUGGING 2 -----

// Interceptor continua igual
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;