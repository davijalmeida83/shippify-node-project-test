import "reflect-metadata";
import express, { Request, Response } from "express";
import { logger } from "./shared/utils/logger";
import { initializeContainer } from "./shared/container";
import routes from "./shared/routes";
import { errorHandlerMiddleware } from "./shared/middleware/error-handler.middleware";

async function startServer() {
  await initializeContainer();
  logger.info("Container inicializado com sucesso");

  const app = express();
  const port = Number(process.env.PORT ?? 3000);

  app.use(express.json());

  app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ status: "ok" });
  });

  app.use(routes);
  app.use(errorHandlerMiddleware);

  app.listen(port, () => {
    logger.info(`API rodando em http://localhost:${port}`);
  });
}

startServer().catch(error => {
  logger.error("Erro ao iniciar servidor:", error);
  process.exit(1);
});
