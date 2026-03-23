import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { logger } from "../../utils/logger";

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
      logger.info("DataSource inicializado com sucesso!");
      isDataSourceInitialized = true;
    } catch (err) {
      logger.error("Erro durante a inicialização do DataSource", err);
      throw err; // Relança o erro para impedir a inicialização da API
    }
  }
};



