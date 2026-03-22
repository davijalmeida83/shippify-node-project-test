import { inject, injectable } from "tsyringe";
import { IUserRepository } from "../repositories/interfaces/user-repository.interface";
import { USER_TOKENS } from "../user-tokens";
import { PublicUserResponseDto } from "../dtos/Response/public-user-response.dto";
import { ToPublicUserService } from "./to-public-user.service";
import { logger } from "../../../shared/utils/logger";

@injectable()
export class GetAllUsersService {
  constructor(
    @inject(USER_TOKENS.UserRepository)
    private readonly userRepository: IUserRepository,

    @inject(USER_TOKENS.ToPublicUserService)
    private readonly toPublicUserService: ToPublicUserService
  ) {}

  public async execute(): Promise<PublicUserResponseDto[]> {
    logger.info(`[GetAllUsersService] Buscando todos os usuários...`);
    const users = await this.userRepository.findAll();
    logger.info(`[GetAllUsersService] ✓ ${users.length} usuário(s) encontrado(s)`);
    return users.map(user => this.toPublicUserService.execute(user));
  }
}