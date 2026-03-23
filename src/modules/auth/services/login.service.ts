import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/app-error";
import { LoginRequestDto } from "../dtos/Request/login-request.dto";
import { AuthResponseDto } from "../dtos/Response/auth-response.dto";
import { AUTH_TOKENS } from "../auth-tokens";
import { IUserFinder } from "../../user/repositories/interfaces/user-finder.interface";
import { verifyPassword } from "../utils/password.util";
import { TokenService } from "./token.service";
import { ToPublicUserService } from "../../user/services/to-public-user.service";
import { USER_TOKENS } from "../../user/user-tokens";
import { logger } from "../../../shared/utils/logger";

@injectable()
export class LoginService {
  constructor(
    @inject(USER_TOKENS.UserRepository)
    private readonly userFinder: IUserFinder,

    @inject(USER_TOKENS.ToPublicUserService)
    private readonly toPublicUserService: ToPublicUserService,

    @inject(AUTH_TOKENS.TokenService)
    private readonly tokenService: TokenService
  ) {}

  public async execute(input: LoginRequestDto): Promise<AuthResponseDto> {
    logger.info(`[LoginService] Iniciando login para email: ${input.email}`);
    const email = input.email.trim().toLowerCase();
    const password = input.password;

    try {
      const user = await this.userFinder.findByEmail(email);
      if (!user) {
        throw new AppError("Invalid credentials", 401);
      }

      const isValidPassword = await verifyPassword(password, user.passwordHash);
      if (!isValidPassword) {
        throw new AppError("Invalid credentials", 401);
      }

      logger.info(`[LoginService] Gerando token...`);
      const publicUser = this.toPublicUserService.execute(user);
      const token = this.tokenService.generateToken(user.id);

      logger.info(`[LoginService] ✓ Login concluído com sucesso`);
      return {
        token,
        user: publicUser,
      };
    } catch (error) {
      throw error;
    }
  }
}