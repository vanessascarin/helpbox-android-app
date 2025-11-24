const express = require('express');
const session = require('express-session');
const cors = require('cors');
const authRoutes = require('./routes/auth'); // Importa seu arquivo de login

const app = express();
const PORT = 3000; // Ou a porta que preferir

// Configuração para permitir JSON
app.use(express.json());

// Configuração de CORS (Permite que o celular acesse o servidor)
app.use(cors());

// Configuração da Sessão (Necessário pois seu login usa req.session)
app.use(session({
    secret: 'segredo_helpbox', // Mude para algo seguro em produção
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // 'false' é importante para rodar localmente (HTTP)
}));

// --- ROTAS ---
// Toda vez que chamar /auth/login, ele vai para o seu arquivo auth.js
app.use('/auth', authRoutes);

// Rota de teste simples
app.get('/', (req, res) => {
    res.send('Servidor HelpBox Backend rodando!');
});

// Inicia o servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Para acesso mobile, use o IP da sua máquina: http://SEU_IP:${PORT}`);
});