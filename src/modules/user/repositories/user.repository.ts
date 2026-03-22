import { injectable } from "tsyringe";
import { User } from "../domain/user";
import { IUserRepository } from "./interfaces/user-repository.interface";
import { BaseRepository } from "../../../shared/repositories/base.repository";

@injectable()
export class UserRepository extends BaseRepository<User> implements IUserRepository {
  constructor() {
    super(User);
  }

  findByEmail(email: string): Promise<User | null> {
    return this.findOne({ where: { email } });
  }

  findById(id: string): Promise<User | null> {
    return this.findOne({ where: { id } });
  }

  findAll(): Promise<User[]> {
    return this.find();
  }
}