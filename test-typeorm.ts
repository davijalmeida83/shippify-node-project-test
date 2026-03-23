import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

const ormConfig = {
  name: "default",
  type: "mysql" as const,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'shippify_user',
  password: process.env.DB_PASSWORD || 'shippify_password',
  database: process.env.DB_NAME || 'shippify_db',
  synchronize: false,
  logging: true, // Ativa logs para ver o que está acontecendo
  entities: [],
  migrations: [],
  subscribers: [],
};

console.log('🔍 Tentando conectar com as seguintes configurações:');
console.log(`   Host: ${ormConfig.host}`);
console.log(`   Port: ${ormConfig.port}`);
console.log(`   User: ${ormConfig.username}`);
console.log(`   Database: ${ormConfig.database}`);
console.log('');

const AppDataSource = new DataSource(ormConfig);

AppDataSource.initialize()
  .then(() => {
    console.log('✅ DataSource inicializado com sucesso!');
    AppDataSource.destroy();
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Erro durante a inicialização do DataSource:');
    console.error(err);
    process.exit(1);
  });
