import { inject, injectable } from "tsyringe";
import { IUserRepository } from "../repositories/interfaces/user-repository.interface";
import { USER_TOKENS } from "../user-tokens";
import { AppError } from "../../../shared/errors/app-error";
import { logger } from "../../../shared/utils/logger";

@injectable()
export class DeleteUserService {
  constructor(
    @inject(USER_TOKENS.UserRepository)
    private readonly userRepository: IUserRepository
  ) {}

  public async execute(id: string): Promise<void> {
    logger.info(`[DeleteUserService] Buscando usuário: ${id}`);
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    logger.info(`[DeleteUserService] Deletando usuário...`);
    await (this.userRepository as any).delete({ id } as any);
    logger.info(`[DeleteUserService] ✓ Usuário deletado com sucesso`);
  }
}