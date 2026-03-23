const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'shippify_user',
      password: 'shippify_password',
      database: 'shippify_db',
      authPlugins: {
        mysql_native_password: () => () => 'shippify_password',
        caching_sha2_password: require('mysql2/lib/auth_plugins/caching_sha2_password')
      },
      connectTimeout: 10000,
      waitForConnections: true,
      connectionLimit: 1,
      queueLimit: 0
    });

    console.log('✅ Conectado ao MySQL com sucesso!');
    
    // Testa uma query simples
    const [rows] = await connection.query('SELECT 1 as test');
    console.log('✅ Query executada:', rows);
    
    await connection.end();
    process.exit(0);
  } catch (err) {
    console.error('❌ Erro:', err.message);
    console.error('Código:', err.code);
    process.exit(1);
  }
}

testConnection();
