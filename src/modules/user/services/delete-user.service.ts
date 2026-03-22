import { inject, injectable } from "tsyringe";
import { IUserRepository } from "../repositories/interfaces/user-repository.interface";
import { USER_TOKENS } from "../user-tokens";
import { AppError } from "../../../shared/errors/app-error";

@injectable()
export class DeleteUserService {
  constructor(
    @inject(USER_TOKENS.UserRepository)
    private readonly userRepository: IUserRepository
  ) {}

  public async execute(id: string): Promise<void> {
    const deleted = await this.userRepository.delete(id);

    if (!deleted) {
      throw new AppError("User not found", 404);
    }
  }
}