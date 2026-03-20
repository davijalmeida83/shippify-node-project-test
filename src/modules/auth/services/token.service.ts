import jwt from "jsonwebtoken";
import { injectable } from "tsyringe";


const JWT_EXPIRES_IN = "1h";

@injectable()
export class TokenService {
  [x: string]: any;
  public generateToken(userId: string): string {
    const secret = process.env.JWT_SECRET ?? "dev-secret-change-me";

    return jwt.sign(
      {
        sub: userId,
      },
      secret,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }
}