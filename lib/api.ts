import axios from 'axios';

// ---------------------------------------------------------
// COLE O SEU LINK DO NGROK AQUI (Mantenha o https://)
// Exemplo: 'https://a1b2-c3d4.ngrok-free.app'
// ---------------------------------------------------------
const API_URL = ' https://ultimately-clamatorial-alisha.ngrok-free.dev'; 

console.log('--- CONFIGURAÇÃO API ---');
console.log('Conectando em:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    // Nota: Ngrok NÃO precisa do header 'Bypass-Tunnel-Reminder'
  },
});

// --- INTERCEPTADORES (Logs para Debug) ---

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
    
    if (error.message === 'Network Error') {
        console.error('ERRO DE REDE: O App não alcançou o Ngrok.');
        console.error('Verifique se o link no api.ts está igual ao do terminal do Ngrok.');
    } else {
        console.error('Detalhe:', error.message);
    }
    
    if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Dados:', error.response.data);
    }
    return Promise.reject(error);
  }
);

export default api;