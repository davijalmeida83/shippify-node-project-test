import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { logger } from "../../../shared/utils/logger";
import { RegisterService } from "../services/register.service";
import { GetAllUsersService } from "../services/get-all-users.service";
import { GetUserByIdService } from "../services/get-user-by-id.service";
import { UpdateUserService } from "../services/update-user.service";
import { DeleteUserService } from "../services/delete-user.service";

@injectable()
class UserController {
  constructor(
    @inject(RegisterService)
    private readonly registerService: RegisterService,

    @inject(GetAllUsersService)
    private readonly getAllUsersService: GetAllUsersService,

    @inject(GetUserByIdService)
    private readonly getUserByIdService: GetUserByIdService,

    @inject(UpdateUserService)
    private readonly updateUserService: UpdateUserService,

    @inject(DeleteUserService)
    private readonly deleteUserService: DeleteUserService
  ) {}

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      logger.info(`[UserController] POST /register recebida`);
      const result = await this.registerService.execute(req.body);
      logger.info(`[UserController] Retornando resposta de registro`);
      res.status(201).json(result);
    } catch (error) {
      logger.error(`[UserController] Erro no register:`, error);
      next(error);
    }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      logger.info(`[UserController] GET /users recebida`);
      const users = await this.getAllUsersService.execute();
      logger.info(`[UserController] Retornando resposta de listar usuários`);
      res.status(200).json(users);
    } catch (error) {
      logger.error(`[UserController] Erro no getAllUsers:`, error);
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      logger.info(`[UserController] GET /users/${id} recebida`);
      const user = await this.getUserByIdService.execute(id);
      logger.info(`[UserController] Retornando resposta de buscar usuário`);
      res.status(200).json(user);
    } catch (error) {
      logger.error(`[UserController] Erro no getUserById:`, error);
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      logger.info(`[UserController] PUT /users/${id} recebida`);
      const updatedData = req.body;
      const updatedUser = await this.updateUserService.execute(id, updatedData);
      logger.info(`[UserController] Retornando resposta de atualizar usuário`);
      res.status(200).json(updatedUser);
    } catch (error) {
      logger.error(`[UserController] Erro no updateUser:`, error);
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      logger.info(`[UserController] DELETE /users/${id} recebida`);
      await this.deleteUserService.execute(id);
      logger.info(`[UserController] Retornando resposta de deletar usuário`);
      res.status(204).send();
    } catch (error) {
      logger.error(`[UserController] Erro no deleteUser:`, error);
      next(error);
    }
  }
}

export { UserController };