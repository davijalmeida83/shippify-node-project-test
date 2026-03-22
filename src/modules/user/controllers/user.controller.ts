import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { RegisterService } from "../services/register.service";
import { GetAllUsersService } from "../services/get-all-users.service";
import { GetUserByIdService } from "../services/get-user-by-id.service";
import { UpdateUserService } from "../services/update-user.service";
import { DeleteUserService } from "../services/delete-user.service";
import { IUserRepository } from "../repositories/interfaces/user-repository.interface";
import { USER_TOKENS } from "../user-tokens";

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
      const result = await this.registerService.execute(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await this.getAllUsersService.execute();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.getUserByIdService.execute(id);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updatedData = req.body;
      const updatedUser = await this.updateUserService.execute(id, updatedData);
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await this.deleteUserService.execute(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export { UserController };