import { container } from "tsyringe";
import { IUserRepository } from "../../modules/user/repositories/interfaces/user-repository.interface";
import { UserRepository } from "../../modules/user/repositories/user.repository";
import { USER_TOKENS } from "../../modules/user/user-tokens";
import { ToPublicUserService } from "../../modules/user/services/to-public-user.service";
import { TokenService } from "../../modules/auth/services/token.service";
import { AUTH_TOKENS } from "../../modules/auth/auth-tokens";
import { AuthService } from "../../modules/auth/services/auth.service";

container.registerSingleton<IUserRepository>(
  USER_TOKENS.UserRepository,
  UserRepository
);

container.registerSingleton(
  USER_TOKENS.ToPublicUserService,
  ToPublicUserService
);

container.registerSingleton(
  AUTH_TOKENS.TokenService,
  TokenService
);

container.registerSingleton(
  AUTH_TOKENS.AuthService,
  AuthService
);

export { container };
