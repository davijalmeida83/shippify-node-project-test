import crypto from "crypto";
import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/app-error";

import { AuthResponseDto } from "../../auth/dtos/Response/auth-response.dto";
import { IUserRepository } from "../repositories/interfaces/user-repository.interface";
import { hashPassword } from "../../auth/utils/password.util";
import { TokenService } from "../../auth/services/token.service";
import { ToPublicUserService } from "./to-public-user.service";
import { RegisterRequestDto } from "../dtos/Request/register-request.dto";
import { USER_TOKENS } from "../user-tokens";
import { AUTH_TOKENS } from "../../auth/auth-tokens";
import { logger } from "../../../shared/utils/logger";

@injectable()
export class RegisterService {
  constructor(
    @inject(USER_TOKENS.UserRepository)
    private readonly userRepository: IUserRepository,

    @inject(USER_TOKENS.ToPublicUserService)
    private readonly toPublicUserService: ToPublicUserService,

    @inject(AUTH_TOKENS.TokenService)
    private readonly tokenService: TokenService
  ) {}

  public async execute(input: RegisterRequestDto): Promise<AuthResponseDto> {
    logger.info(`[RegisterService] Iniciando registro para email: ${input.email}`);
    
    const name = input.name.trim();
    const email = input.email.trim().toLowerCase();
    const password = input.password;

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError("User already exists", 400);
    }

    const hashedPassword = await hashPassword(password);
      
    logger.info(`[RegisterService] Criando usuário...`);
    const user = this.userRepository.create({
        id: crypto.randomUUID(),
        name,
        email,
        passwordHash: hashedPassword,
    });

    await this.userRepository.save(user);
    logger.info(`[RegisterService] ✓ Registro concluído com sucesso`);
    
    logger.info(`[RegisterService] Gerando token...`);
    const token = await this.tokenService.generateToken(user.id);
    
    logger.info(`[RegisterService] Convertendo para public user...`);
    const publicUser = this.toPublicUserService.execute(user);

    return {
      token,
      user: publicUser,
    };
  }
}