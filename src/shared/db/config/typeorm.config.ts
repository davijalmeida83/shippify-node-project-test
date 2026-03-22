import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

// Carrega ormconfig.json com valores padrão
const ormConfig = require("./ormconfig.json");

// Sobrescreve com variáveis de ambiente
const dataSourceOptions = {
  ...ormConfig,
  host: process.env.DB_HOST || ormConfig.host,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : ormConfig.port,
  username: process.env.DB_USERNAME || ormConfig.username,
  password: process.env.DB_PASSWORD || ormConfig.password,
  database: process.env.DB_NAME || ormConfig.database,
} as any;

export const AppDataSource = new DataSource(dataSourceOptions);

let isDataSourceInitialized = false;

export const initializeDataSource = async () => {
  if (!isDataSourceInitialized) {
    try {
      await AppDataSource.initialize();
      console.log("DataSource inicializado com sucesso!");
      isDataSourceInitialized = true;
    } catch (err) {
      console.error("Erro durante a inicialização do DataSource", err);
    }
  }
};



