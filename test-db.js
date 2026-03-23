const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'shippify_user',
  password: 'shippify_password',
  database: 'shippify_db',
  connectionLimit: 5,
  connectTimeout: 30000
});

connection.connect((err) => {
  if (err) {
    console.error('Erro de conexão:', err.message);
    process.exit(1);
  }
  console.log('Conectado com sucesso!');
  connection.end();
  process.exit(0);
});
