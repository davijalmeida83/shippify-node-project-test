import { IsEmail, IsNotEmpty } from "class-validator";
import { Expose } from "class-transformer";

export class LoginRequestDto {
  @Expose()
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Invalid email format" })
  email!: string;

  @Expose()
  @IsNotEmpty({ message: "Password is required" })
  password!: string;
}
