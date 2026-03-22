import { User } from "../../domain/user";
import { FindOptionsWhere, DeleteResult } from "typeorm";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
  create(user: User): User;
  delete(criteria: any): Promise<DeleteResult>;
}