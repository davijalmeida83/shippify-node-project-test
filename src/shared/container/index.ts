import { container } from "tsyringe";
import { IUserRepository } from "../../modules/auth/repositories/interfaces/user-repository.interface";
import { UserRepository } from "../../modules/auth/repositories/user.repository";
import { AUTH_TOKENS } from "../../modules/auth/tokens";

container.registerSingleton<IUserRepository>(
  AUTH_TOKENS.UserRepository,
  UserRepository
);

export { container };
