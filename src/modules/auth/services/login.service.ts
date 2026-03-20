import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/app-error";
import { LoginRequestDto } from "../dtos/Request/login-request.dto";
import { AuthResponseDto } from "../dtos/Response/auth-response.dto";
import { AUTH_TOKENS } from "../auth-tokens";
import { IUserRepository } from "../../user/repositories/interfaces/user-repository.interface";
import { verifyPassword } from "../utils/password.util";
import { TokenService } from "./token.service";
import { ToPublicUserService } from "../../user/services/to-public-user.service";
import { USER_TOKENS } from "../../user/user-tokens";

@injectable()
export class LoginService {
  constructor(
    @inject(USER_TOKENS.UserRepository)
    private readonly userRepository: IUserRepository,

    @inject(USER_TOKENS.ToPublicUserService)
    private readonly toPublicUserService: ToPublicUserService,

    @inject(AUTH_TOKENS.AuthService)
    private readonly tokenService: TokenService
  ) {}

  public async execute(input: LoginRequestDto): Promise<AuthResponseDto> {
    const email = input.email?.trim().toLowerCase();
    const password = input.password;

    if (!email || !password) {
      throw new AppError("email e password são obrigatórios", 400);
    }

    const user = this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError("credenciais inválidas", 401);
    }

    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      throw new AppError("credenciais inválidas", 401);
    }

    const publicUser = this.toPublicUserService.execute(user);
    const token = this.tokenService.generate(publicUser);

    return {
      token,
      user: publicUser,
    };
  }
}