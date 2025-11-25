const sql = require('mssql');

const config = {
    user: 'micaiasadm',       // Seu usuário do Azure
    password: 'Monteiro140',  // Sua senha do Azure
    server: 'helpbox.database.windows.net', // O endereço do servidor na nuvem
    database: 'Helpbox',      // O nome do banco lá no Azure
    port: 1433,
    options: {
        encrypt: true, // OBRIGATÓRIO para Azure
        enableArithAbort: true,
        trustServerCertificate: false // No Azure geralmente é false (confia no certificado oficial)
    }
};

let poolPromise;

const getPool = async () => {
  if (!poolPromise) {
    poolPromise = new sql.ConnectionPool(config)
      .connect()
      .then(pool => {
        console.log('☁️ Conectado ao Azure SQL Database (Helpbox) com Sucesso!');
        return pool;
      })
      .catch(err => {
        console.error('❌ Falha na conexão com o Azure:', err);
        
        // Ajuda para debugar erro de Firewall
        if (err.originalError && err.originalError.message.includes('Client with IP address')) {
            console.error('\n⚠️ ERRO DE FIREWALL DO AZURE DETECTADO! ⚠️');
            console.error('Você precisa ir no Portal do Azure > SQL Database > Set server firewall');
            console.error('E adicionar o seu IP atual às regras permitidas.\n');
        }
        
        process.exit(1);
      });
  }
  return poolPromise;
};

module.exports = {
    getPool,
    sql
};