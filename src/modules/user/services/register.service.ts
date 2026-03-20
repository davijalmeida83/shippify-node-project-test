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
import { User } from "../domain/user";

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
    const name = input.name?.trim();
    const email = input.email?.trim().toLowerCase();
    const password = input.password;

    if (!name || !email || !password) {
      throw new AppError("name, email e password são obrigatórios", 400);
    }

    if (password.length < 6) {
      throw new AppError("password deve ter no mínimo 6 caracteres", 400);
    }

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError("usuário já existe", 400);
    }

    const hashedPassword = await hashPassword(password);
      
    const user = this.userRepository.create({
        id: crypto.randomUUID(),
        name,
        email,
        passwordHash: hashedPassword,
    });

    await this.userRepository.save(user);

    const publicUser = this.toPublicUserService.execute(user); 
    const token = await this.tokenService.generateToken(user.id);

    return {
      token,
      user: publicUser,
    };
  }
}