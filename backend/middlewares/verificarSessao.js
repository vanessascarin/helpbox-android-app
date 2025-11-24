// Middleware simples para verificar se existe usuário na sessão
function verificaSessao(req, res, next) {
    if (req.session && req.session.usuario) {
        return next();
    } else {
        return res.status(401).json({ error: 'Acesso não autorizado. Faça login.' });
    }
}

module.exports = verificaSessao;