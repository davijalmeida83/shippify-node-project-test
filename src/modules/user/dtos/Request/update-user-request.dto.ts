import { IsEmail, IsOptional, MaxLength } from "class-validator";
import { Expose } from "class-transformer";

export class UpdateUserRequestDto {
  @Expose()
  @IsOptional()
  @MaxLength(255, { message: "Name must not exceed 255 characters" })
  name?: string;

  @Expose()
  @IsOptional()
  @IsEmail({}, { message: "Invalid email format" })
  email?: string;
}
