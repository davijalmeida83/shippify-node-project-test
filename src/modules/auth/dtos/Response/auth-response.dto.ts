import { PublicUserResponseDto } from "./public-user-response.dto";

export interface AuthResponseDto {
  token: string;
  user: PublicUserResponseDto;
}
