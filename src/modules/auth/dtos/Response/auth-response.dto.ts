import { PublicUserResponseDto } from "../../../user/dtos/Response/public-user-response.dto";

export interface AuthResponseDto {
  token: string;
  user: PublicUserResponseDto;
}
