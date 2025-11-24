const sql = require('mssql/msnodesqlv8');

const config = {
    database: 'HelpBoxDB',
    // TENTATIVA VIA LOCALHOST + PORTA (Geralmente infalível se o passo 1 foi feito)
    server: 'localhost', 
    port: 1433, 
    driver: 'msnodesqlv8',
    options: {
        trustedConnection: true,
        trustServerCertificate: true
    }
};

let poolPromise;

const getPool = async () => {
  if (!poolPromise) {
    poolPromise = new sql.ConnectionPool(config)
      .connect()
      .then(pool => {
        console.log('✅ Conectado ao SQL Server com Sucesso!');
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