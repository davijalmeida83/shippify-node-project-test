/// <reference path="./shared/types/express.d.ts" />
import "reflect-metadata";
import express, { NextFunction, Request, Response } from "express";
import "./shared/container";
import { AppError } from "./shared/errors/app-error";
import routes from "./shared/routes";
import { errorHandlerMiddleware } from "./shared/middleware/error-handler.middleware";
import { initializeContainer } from "./shared/container";

(async () => {
 
  await initializeContainer();
  console.log("ContainerRegister inicializado com sucesso.");

  const app = express();
  const port = Number(process.env.PORT ?? 3000);

  app.use(express.json());

  app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ status: "ok" });
  });

  app.use(routes);

  app.use(errorHandlerMiddleware);

  app.listen(port, () => {
    console.log(`API rodando em http://localhost:${port}`);
  });
})();
