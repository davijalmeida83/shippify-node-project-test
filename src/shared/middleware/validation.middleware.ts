import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { AppError } from "../errors/app-error";
import { logger } from "../utils/logger";

export function validateRequestBodyDto(dtoClass: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info(`[Validation] Validando ${dtoClass.name}...`);
      
      // Descobrir campos permitidos transformando com excludeExtraneousValues
      // e comparando quais campos foram mantidos
      const testInstance = plainToInstance(dtoClass, req.body, {
        excludeExtraneousValues: true,
        exposeUnsetFields: false,
      });
      
      const allowedFields = Object.keys(testInstance).filter(key => testInstance.hasOwnProperty(key));
      const requestFields = Object.keys(req.body);
      const forbiddenFields = requestFields.filter(field => !allowedFields.includes(field));
      
      if (forbiddenFields.length > 0) {
        throw new AppError(`Forbidden field(s): ${forbiddenFields.join(', ')}`, 400);
      }
      
      const dtoInstance = testInstance;
      
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
      logger.error(`[Validation] Erro ao validar ${dtoClass.name}:`, error);
      next(error);
    }
  };
}
