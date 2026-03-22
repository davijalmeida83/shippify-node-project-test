import { inject, injectable } from "tsyringe";
import { IUserRepository } from "../repositories/interfaces/user-repository.interface";
import { USER_TOKENS } from "../user-tokens";
import { User } from "../domain/user";

@injectable()
export class GetAllUsersService {
  constructor(
    @inject(USER_TOKENS.UserRepository)
    private readonly userRepository: IUserRepository
  ) {}

  public async execute(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}