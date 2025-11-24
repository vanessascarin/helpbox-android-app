const express = require('express');
const router = express.Router();
const { getPool, sql } = require('../db.js');

// NÃO precisamos mais importar iaService nem verificarADM
// pois removemos as rotas que usavam eles.

// ====================================================================
// 🛠️ FUNÇÃO AUXILIAR (REUTILIZADA DA WEB)
// ====================================================================
// Mantivemos essa função IDÊNTICA à Web para garantir que a listagem
// e a ordenação sejam as mesmas nas duas plataformas.
async function fetchChamadosList(req, res, customWhere = '', customOrder = '', params = {}) {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;
    const offset = (page - 1) * pageSize;
    
    const usuarioLogadoId = params.usuarioId || req.session?.usuario?.id || 0;
    const searchTerm = (req.query.q || '').trim();
    const statusFilter = req.query.status || '';
    const isNumericInput = /^\d+$/.test(searchTerm);

    let whereClause = `1 = 1`;
    
    if (customWhere) whereClause += ` AND ${customWhere}`;
    if (statusFilter) whereClause += ` AND C.status_Cham = @statusFilter`;
    
    if (searchTerm) {
        if (isNumericInput) {
            whereClause += ` AND (
                CAST(C.id_Cham AS NVARCHAR(20)) LIKE @searchIdPattern 
                OR C.titulo_Cham LIKE @searchTerm 
                OR C.descricao_Cham LIKE @searchTerm
            )`;
        } else {
            whereClause += ` AND (C.titulo_Cham LIKE @searchTerm OR C.descricao_Cham LIKE @searchTerm)`;
        }
    }

    // Lógica de ordenação SQL (Idêntica à Web)
    const defaultOrder = `
        ORDER BY 
        CASE 
            WHEN C.status_Cham = 'Em andamento' AND C.tecResponsavel_Cham = @usuarioId THEN 0 
            WHEN C.status_Cham = 'Em andamento' 
                 AND (C.tecResponsavel_Cham IS NULL OR C.tecResponsavel_Cham = 0)
                 AND C.clienteId_Cham <> @usuarioId THEN 1
            ELSE 2 
        END ASC,
        CASE WHEN C.status_Cham = 'Aberto' THEN 0 ELSE 1 END ASC,
        C.dataAbertura_Cham DESC 
    `;
    
    const finalOrder = customOrder || defaultOrder;

    try {
        const pool = await getPool();
        const request = pool.request()
            .input('offset', sql.Int, offset)
            .input('pageSize', sql.Int, pageSize)
            .input('statusFilter', sql.NVarChar, statusFilter)
            .input('searchTerm', sql.NVarChar, `%${searchTerm}%`)
            .input('usuarioId', sql.Int, usuarioLogadoId);

        if (isNumericInput) {
            request.input('searchIdPattern', sql.NVarChar, `${searchTerm}%`);
        }

        for (const [key, value] of Object.entries(params)) {
            if (key !== 'usuarioId') {
                request.input(key, sql.Int, value);
            }
        }

        const query = `
            SELECT C.id_Cham, C.titulo_Cham, C.status_Cham, C.dataAbertura_Cham, 
                   C.prioridade_Cham, C.descricao_Cham,
                   U.nome_User, U.sobrenome_User, 
                   TEC.nome_User as tecNome, TEC.sobrenome_User as tecSobrenome
            FROM Chamado AS C
            INNER JOIN Usuario AS U ON C.clienteId_Cham = U.id_User
            LEFT JOIN Usuario AS TEC ON C.tecResponsavel_Cham = TEC.id_User
            WHERE ${whereClause}
            ${finalOrder}
            OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY;

            SELECT COUNT(C.id_Cham) AS totalCount 
            FROM Chamado AS C
            WHERE ${whereClause};
        `;

        const result = await request.query(query);

        res.json({
            chamados: result.recordsets[0],
            totalCount: result.recordsets[1][0].totalCount,
            page,
            pageSize
        });

    } catch (error) {
        console.error('Erro fetchChamadosList:', error);
        res.status(500).json({ error: 'Erro ao listar chamados.' });
    }
}

// ====================================================================
// 🚦 ROTAS DE LEITURA (GET) - APENAS O NECESSÁRIO
// ====================================================================

// 1. MEUS CHAMADOS (A rota que o App vai usar)
router.get('/meus', async (req, res) => {
    const usuarioId = req.session?.usuario?.id;
    const tipoFilter = req.query.tipo || ''; 

    if (!usuarioId) return res.status(401).json({ error: 'Não autenticado' });

    let where = '';
    
    // Filtros de escopo
    if (tipoFilter === 'criado') {
        where = `C.clienteId_Cham = @usuarioId`;
    } else if (tipoFilter === 'atribuido') {
        where = `C.tecResponsavel_Cham = @usuarioId`;
    } else {
        where = `(C.tecResponsavel_Cham = @usuarioId OR C.clienteId_Cham = @usuarioId)`;
    }

    // Ordenação personalizada (seus chamados em andamento primeiro)
    const order = `
        ORDER BY 
        CASE WHEN C.status_Cham = 'Em andamento' AND C.tecResponsavel_Cham = @usuarioId THEN 0 ELSE 1 END ASC,
        CASE C.status_Cham WHEN 'Em andamento' THEN 1 WHEN 'Aberto' THEN 2 WHEN 'Fechado' THEN 3 ELSE 9 END ASC,
        C.dataAbertura_Cham DESC
    `;

    await fetchChamadosList(req, res, where, order, { usuarioId });
});

// 2. DETALHES DO CHAMADO (Para quando clicar no card)
router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

    try {
        const pool = await getPool();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT C.*, 
                       U.nome_User as clienteNome, U.sobrenome_User as clienteSobrenome,
                       TEC.nome_User as tecNome, TEC.sobrenome_User as tecSobrenome
                FROM Chamado C
                INNER JOIN Usuario U ON C.clienteId_Cham = U.id_User
                LEFT JOIN Usuario TEC ON C.tecResponsavel_Cham = TEC.id_User
                WHERE C.id_Cham = @id
            `);

        if (result.recordset.length === 0) return res.status(404).json({ error: 'Chamado não encontrado.' });
        res.json(result.recordset[0]);
    } catch (error) {
        console.error('Erro GET ID:', error);
        res.status(500).json({ error: 'Erro interno.' });
    }
});

module.exports = router;