const sql = require('mssql'); // Usamos o driver padrão agora (mais estável)

const config = {
    user: 'micaiasadm',       // Seu super usuário
    password: 'Monteiro140',  // Sua senha
    server: 'localhost',      // Como habilitamos a porta 1433, localhost funciona bem
    port: 1433,               // Garante que vai bater na porta certa
    database: 'HelpboxMobileBD', // O nome do seu novo banco
    options: {
        encrypt: false, // 'false' é melhor para conexões locais
        trustServerCertificate: true // Aceita certificados locais
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