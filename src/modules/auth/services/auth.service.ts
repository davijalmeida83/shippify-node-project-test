import { injectable } from "tsyringe";

@injectable()
export class AuthService {
  public authenticate(): string {
    return "Authenticated";
  }
}