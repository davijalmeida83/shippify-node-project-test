import { inject, injectable } from "tsyringe";
import { IUserFinder } from "../repositories/interfaces/user-finder.interface";
import { IUserPersistence } from "../repositories/interfaces/user-persistence.interface";
import { USER_TOKENS } from "../user-tokens";
import { AppError } from "../../../shared/errors/app-error";
import { logger } from "../../../shared/utils/logger";

@injectable()
export class DeleteUserService {
  constructor(
    @inject(USER_TOKENS.UserRepository)
    private readonly userFinder: IUserFinder,

    @inject(USER_TOKENS.UserRepository)
    private readonly userPersistence: IUserPersistence
  ) {}

  /**
   * Deleta um usuário do sistema
   * @param id Identificador único do usuário a ser deletado
   * @throws AppError Se o usuário não for encontrado
   */
  public async execute(id: string): Promise<void> {
    logger.info(`[DeleteUserService] Buscando usuário: ${id}`);
    const user = await this.userFinder.findById(id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    logger.info(`[DeleteUserService] Deletando usuário...`);
    await this.userPersistence.delete({ id });
    logger.info(`[DeleteUserService] ✓ Usuário deletado com sucesso`);
  }
}