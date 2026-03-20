import { User } from "../../domain/user";

export interface IUserRepository {
  findByEmail(email: string): User | null;
  save(user: User): Promise<void>;
  create(user: User): User;
}