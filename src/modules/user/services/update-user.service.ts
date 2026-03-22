import { inject, injectable } from "tsyringe";
import { IUserFinder } from "../repositories/interfaces/user-finder.interface";
import { IUserPersistence } from "../repositories/interfaces/user-persistence.interface";
import { USER_TOKENS } from "../user-tokens";
import { PublicUserResponseDto } from "../dtos/Response/public-user-response.dto";
import { UpdateUserRequestDto } from "../dtos/Request/update-user-request.dto";
import { AppError } from "../../../shared/errors/app-error";
import { ToPublicUserService } from "./to-public-user.service";
import { User } from "../domain/user";
import { logger } from "../../../shared/utils/logger";

@injectable()
export class UpdateUserService {
  constructor(
    @inject(USER_TOKENS.UserRepository)
    private readonly userFinder: IUserFinder,

    @inject(USER_TOKENS.UserRepository)
    private readonly userPersistence: IUserPersistence,

    @inject(USER_TOKENS.ToPublicUserService)
    private readonly toPublicUserService: ToPublicUserService
  ) {}

  /**
   * Atualiza os dados de um usuário
   * @param id Identificador único do usuário
   * @param updatedData Dados a serem atualizados (nome e/ou email)
   * @returns Dados públicos do usuário atualizado
   * @throws AppError Se o usuário não existir ou email já estiver em uso
   */
  public async execute(id: string, updatedData: UpdateUserRequestDto): Promise<PublicUserResponseDto> {
    logger.info(`[UpdateUserService] Atualizando usuário: ${id}`);
    const user = await this.userFinder.findById(id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Validar email se está sendo alterado
    if (updatedData.email && updatedData.email !== user.email) {
      logger.info(`[UpdateUserService] Validando email...`);
      const existingUser = await this.userFinder.findByEmail(updatedData.email);
      if (existingUser) {
        throw new AppError("Email already in use", 400);
      }
    }

    Object.assign(user, updatedData);
    await this.userPersistence.save(user);
    logger.info(`[UpdateUserService] ✓ Usuário atualizado com sucesso`);

    return this.toPublicUserService.execute(user);
  }
}
