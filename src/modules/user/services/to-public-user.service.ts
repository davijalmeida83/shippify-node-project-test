
import { User } from "../domain/user";
import { PublicUserResponseDto } from "../dtos/Response/public-user-response.dto";


export class ToPublicUserService {
  public execute(user: User): PublicUserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}