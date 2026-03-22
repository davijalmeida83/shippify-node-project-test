import { DataSource } from "typeorm";
import path from "path";

import dotenv from "dotenv";
dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  driver: require("mysql2"), 
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USERNAME || "shippify_user",
  password: process.env.DB_PASSWORD || "shippify_password",
  database: process.env.DB_NAME || "shippify_db",
  synchronize: false, // Disable synchronize to use migrations
  logging: false,
  migrations: [path.join(__dirname, "../migrations/*.{ts,js}")],
});

let isDataSourceInitialized = false;

export const initializeDataSource = async () => {
  if (!isDataSourceInitialized) {
    try {
      await AppDataSource.initialize();
      console.log("Data Source has been initialized!");
      isDataSourceInitialized = true;
    } catch (err) {
      console.error("Error during Data Source initialization", err);
    }
  }
};