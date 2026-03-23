import { inject, injectable } from "tsyringe";
import { IUserFinder } from "../repositories/interfaces/user-finder.interface";
import { USER_TOKENS } from "../user-tokens";
import { PublicUserResponseDto } from "../dtos/Response/public-user-response.dto";
import { ToPublicUserService } from "./to-public-user.service";
import { logger } from "../../../shared/utils/logger";

@injectable()
export class GetAllUsersService {
  constructor(
    @inject(USER_TOKENS.UserRepository)
    private readonly userFinder: IUserFinder,

    @inject(USER_TOKENS.ToPublicUserService)
    private readonly toPublicUserService: ToPublicUserService
  ) {}

  /**
   * Retorna todos os usuários do sistema em formato público
   * @returns Lista de usuários sem dados sensíveis
   */
  public async execute(): Promise<PublicUserResponseDto[]> {
    logger.info(`[GetAllUsersService] Buscando todos os usuários...`);
    const users = await this.userFinder.findAll();
    logger.info(`[GetAllUsersService] ✓ ${users.length} usuário(s) encontrado(s)`);
    return users.map(user => this.toPublicUserService.execute(user));
  }
}