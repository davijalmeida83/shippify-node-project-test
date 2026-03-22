import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { logger } from "../../../shared/utils/logger";
import { LoginService } from "../services/login.service";

@injectable()
class AuthController {
  constructor(
      @inject(LoginService)
      private readonly loginService: LoginService
  ) {}

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      logger.info(`[AuthController] POST /login recebida`);
      const result = await this.loginService.execute(req.body);
      logger.info(`[AuthController] Retornando resposta de login`);
      res.status(200).json(result);
    } catch (error) {
      logger.error(`[AuthController] Erro no login:`, error);
      next(error);
    }
  }
}

export { AuthController };
