import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error";

export function errorHandlerMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("Erro capturado pelo errorHandlerMiddleware:", {
    rota: req.originalUrl,
    metodo: req.method,
    corpo: req.body,
    erro: error.message,
    stack: error.stack,
  });

  if (error instanceof AppError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  res.status(500).json({ message: "Erro interno do servidor" });
}