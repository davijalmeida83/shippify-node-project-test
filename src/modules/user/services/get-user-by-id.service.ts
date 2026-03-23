import { inject, injectable } from "tsyringe";
import { IUserFinder } from "../repositories/interfaces/user-finder.interface";
import { USER_TOKENS } from "../user-tokens";
import { PublicUserResponseDto } from "../dtos/Response/public-user-response.dto";
import { AppError } from "../../../shared/errors/app-error";
import { ToPublicUserService } from "./to-public-user.service";
import { logger } from "../../../shared/utils/logger";
import { Cached } from "../../../shared/cache/decorators/cache.decorator";
import { REDIS_CONFIG } from "../../../shared/config/redis.config";

@injectable()
export class GetUserByIdService {
  constructor(
    @inject(USER_TOKENS.UserRepository)
    private readonly userFinder: IUserFinder,

    @inject(USER_TOKENS.ToPublicUserService)
    private readonly toPublicUserService: ToPublicUserService
  ) {}

  @Cached({
    key: `${REDIS_CONFIG.keyPrefix.user}{{0}}`,
    ttl: REDIS_CONFIG.ttl.user,
  })
  public async execute(id: string): Promise<PublicUserResponseDto> {
    logger.info(`[GetUserByIdService] Buscando usuário: ${id}`);
    const user = await this.userFinder.findById(id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    logger.info(`[GetUserByIdService] ✓ Usuário encontrado`);
    return this.toPublicUserService.execute(user);
  }
}