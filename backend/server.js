const express = require('express');
const session = require('express-session');
const cors = require('cors');
const authRoutes = require('./routes/auth');
// 1. IMPORTAR A NOVA ROTA
const ticketRoutes = require('./routes/tickets'); 

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

app.use(session({
    secret: 'segredo_helpbox',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// --- ROTAS ---
app.use('/auth', authRoutes);
// 2. USAR A NOVA ROTA
app.use('/tickets', ticketRoutes); 

app.get('/', (req, res) => {
    res.send('Servidor HelpBox Backend rodando!');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    // O IP aqui é apenas visual, o importante é o código
    console.log(`Para acesso mobile: http://SEU_IP_AQUI:${PORT}`);
});