import { inject, injectable } from "tsyringe";
import { IUserRepository } from "../repositories/interfaces/user-repository.interface";
import { USER_TOKENS } from "../user-tokens";
import { PublicUserResponseDto } from "../dtos/Response/public-user-response.dto";
import { ToPublicUserService } from "./to-public-user.service";

@injectable()
export class GetAllUsersService {
  constructor(
    @inject(USER_TOKENS.UserRepository)
    private readonly userRepository: IUserRepository,

    @inject(USER_TOKENS.ToPublicUserService)
    private readonly toPublicUserService: ToPublicUserService
  ) {}

  public async execute(): Promise<PublicUserResponseDto[]> {
    const users = await this.userRepository.findAll();
    return users.map(user => this.toPublicUserService.execute(user));
  }
}