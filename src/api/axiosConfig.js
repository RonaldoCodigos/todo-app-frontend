// Em: src/api/axiosConfig.js
// TESTE SIMPLIFICADO E COM HACK NO INTERCEPTOR

import axios from 'axios';

// Pega a URL da API da variável de ambiente VITE_API_URL
const apiURL = import.meta.env.VITE_API_URL;

console.log("[axiosConfig] VITE_API_URL lida no topo:", apiURL); // Log 1

// Cria a instância do axios
const apiClient = axios.create({
  // Tenta definir a baseURL
  baseURL: `${apiURL}/api`,
});

console.log("[axiosConfig] Axios baseURL inicial configurada:", apiClient.defaults.baseURL); // Log 2

// Interceptor: Adiciona o token E TENTA CORRIGIR A BASEURL SE NECESSÁRIO
apiClient.interceptors.request.use(
  (config) => {
    // Tenta pegar a variável de ambiente DE NOVO aqui dentro
    const currentApiUrl = import.meta.env.VITE_API_URL;
    console.log("[Interceptor] VITE_API_URL lida no interceptor:", currentApiUrl); // Log 3

    // HACK: Se a baseURL ainda estiver errada (localhost ou indefinida), força a correta
    if (!config.baseURL || config.baseURL === '/api' || config.baseURL.includes('localhost')) {
         if(currentApiUrl) { // Só define se a URL foi lida
            console.warn("[Interceptor] CORRIGINDO baseURL para:", `${currentApiUrl}/api`); // Log Aviso
            config.baseURL = `${currentApiUrl}/api`;
         } else {
            console.error("[Interceptor] ERRO: VITE_API_URL não lida, impossível corrigir baseURL!"); // Log Erro
         }
    }

    // Adiciona o token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    console.log("[Interceptor] Config Final da Requisição:", config); // Log 4 (Mostra a URL final)
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;