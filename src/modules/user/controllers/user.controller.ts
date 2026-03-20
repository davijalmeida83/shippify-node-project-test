import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { RegisterService } from "../services/register.service";

@injectable()
class UserController {
  constructor(
      @inject(RegisterService)
      private readonly registerService: RegisterService
  ) {}

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.registerService.execute(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export { UserController };