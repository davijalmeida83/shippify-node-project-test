import "reflect-metadata";
import express, { NextFunction, Request, Response } from "express";
import "./shared/container";
import { AppError } from "./shared/errors/app-error";
import routes from "./shared/routes";

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

app.use(routes);

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  res.status(500).json({ message: "erro interno do servidor" });
});

app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});
