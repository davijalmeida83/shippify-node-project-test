import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { AppError } from "../errors/app-error";

export function validateRequestBodyDto(dtoClass: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dtoInstance = plainToInstance(dtoClass, req.body);
      const errors = await validate(dtoInstance);

      if (errors.length > 0) {
        const messages = errors
          .map(error => Object.values(error.constraints || {}).join(", "))
          .join("; ");

        throw new AppError(messages, 400);
      }

      // Substitui o objeto body pelo DTO validado e transformado
      req.body = dtoInstance;
      next();
    } catch (error) {
      next(error);
    }
  };
}
