import { User } from "../../domain/user";
import { FindOptionsWhere, DeleteResult } from "typeorm";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  save(user: User): Promise<void>;
  create(user: User): User;
}