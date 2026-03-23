const redis = require('redis');

const client = redis.createClient({
  host: 'localhost',
  port: 6379,
  socket: {
    reconnectStrategy: () => new Error('stop'),
    connectTimeout: 30000
  }
});

client.on('error', (err) => {
  console.error('Erro ao conectar ao Redis:', err.message);
  process.exit(1);
});

client.on('connect', () => {
  console.log('Conectado ao Redis com sucesso!');
  client.quit();
  process.exit(0);
});

client.connect();
