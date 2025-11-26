import axios from 'axios';

// VOLTAMOS PARA O IP LOCAL
const API_URL = 'http://192.168.126.168:3000'; 

console.log('--- CONFIGURAÇÃO API (LOCAL) ---');
console.log('Conectando em:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(request => {
  console.log('🚀 [API] Enviando para:', request.url);
  return request;
});

api.interceptors.response.use(
  response => {
    console.log('✅ [API] Sucesso:', response.status);
    return response;
  },
  error => {
    console.log('❌ [API] Erro!');
    console.error('Detalhe:', error.message);
    
    if (error.message === 'Network Error') {
        console.error('ERRO DE REDE: Possíveis causas:');
        console.error('1. Firewall do Windows bloqueando a porta 3000');
        console.error('2. Celular e PC em Wi-Fi diferentes');
        console.error('3. Backend (server.js) não está rodando');
    }

    if (error.response) {
        console.error('Dados:', error.response.data);
    }
    return Promise.reject(error);
  }
);

export default api;