// Em: src/api/axiosConfig.js
// VERSÃO FINAL (Lendo a variável de ambiente)

import axios from 'axios';

// 1. Pega a URL da API da variável de ambiente VITE_API_URL
//    (Definida no .env para localhost OU nas settings da Vercel para produção)
const apiURL = import.meta.env.VITE_API_URL;

// ----- DEBUGGING -----
// Este log nos ajuda a confirmar qual URL está sendo usada no build
console.log("API URL usada pelo Axios:", apiURL); 
// ----- FIM DEBUGGING -----

// 2. Cria uma "instância" do axios pré-configurada
const apiClient = axios.create({
  // Define a URL base para TODAS as chamadas, incluindo o /api
  baseURL: `${apiURL}/api`, 
});

// ----- DEBUGGING 2 -----
// Loga a baseURL que o Axios REALMENTE configurou
console.log("Axios baseURL configurada:", apiClient.defaults.baseURL); 
// ----- FIM DEBUGGING 2 -----

// 3. Interceptor: Adiciona o token JWT automaticamente em todas as requisições
apiClient.interceptors.request.use(
  (config) => {
    // Pega o token do localStorage
    const token = localStorage.getItem('token');
    // Se o token existir, adiciona no cabeçalho 'Authorization'
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    // Retorna a configuração modificada (ou original se não tiver token)
    return config;
  },
  (error) => {
    // Se houver erro na configuração da requisição, rejeita a promessa
    return Promise.reject(error);
  }
);

// Exporta a instância configurada do Axios para ser usada em outros arquivos
export default apiClient;