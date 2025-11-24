const sql = require('mssql'); // Driver padrão (mais estável)

const config = {
    user: 'micaiasadm',       // Seu usuário SQL
    password: 'Monteiro140',  // Sua senha SQL
    server: 'localhost',      
    port: 1433,               // Porta fixa (aquela que habilitamos no IPAll)
    database: 'HelpboxMobileBD', // Nome do banco novo
    options: {
        encrypt: false, // Necessário false para conexão local
        trustServerCertificate: true // Aceita certificado auto-assinado
    }
};

let poolPromise;

const getPool = async () => {
  if (!poolPromise) {
    poolPromise = new sql.ConnectionPool(config)
      .connect()
      .then(pool => {
        console.log('✅ Conectado ao SQL Server (HelpboxMobileBD) com Sucesso!');
        return pool;
      })
      .catch(err => {
        console.error('❌ Falha na conexão com o banco:', err);
        console.error('Detalhe:', JSON.stringify(err, null, 2));
        process.exit(1);
      });
  }
  return poolPromise;
};

module.exports = {
    getPool,
    sql
};