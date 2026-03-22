import { inject, injectable } from "tsyringe";
import { IUserRepository } from "../repositories/interfaces/user-repository.interface";
import { USER_TOKENS } from "../user-tokens";
import { User } from "../domain/user";
import { AppError } from "../../../shared/errors/app-error";

@injectable()
export class UpdateUserService {
  constructor(
    @inject(USER_TOKENS.UserRepository)
    private readonly userRepository: IUserRepository
  ) {}

  public async execute(id: string, updatedData: Partial<User>): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    Object.assign(user, updatedData);
    await this.userRepository.save(user);

    return user;
  }
}