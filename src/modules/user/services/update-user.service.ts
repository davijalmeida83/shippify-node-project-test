import { inject, injectable } from "tsyringe";
import { IUserRepository } from "../repositories/interfaces/user-repository.interface";
import { USER_TOKENS } from "../user-tokens";
import { PublicUserResponseDto } from "../dtos/Response/public-user-response.dto";
import { AppError } from "../../../shared/errors/app-error";
import { ToPublicUserService } from "./to-public-user.service";
import { User } from "../domain/user";

@injectable()
export class UpdateUserService {
  constructor(
    @inject(USER_TOKENS.UserRepository)
    private readonly userRepository: IUserRepository,

    @inject(USER_TOKENS.ToPublicUserService)
    private readonly toPublicUserService: ToPublicUserService
  ) {}

  public async execute(id: string, updatedData: Partial<User>): Promise<PublicUserResponseDto> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Validar email se está sendo alterado
    if (updatedData.email && updatedData.email !== user.email) {
      const existingUser = await this.userRepository.findByEmail(updatedData.email);
      if (existingUser) {
        throw new AppError("Email already in use", 400);
      }
    }

    Object.assign(user, updatedData);
    await this.userRepository.save(user);

    return this.toPublicUserService.execute(user);
  }
}
