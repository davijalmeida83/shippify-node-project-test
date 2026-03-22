import { injectable } from "tsyringe";
import { Repository } from "typeorm";
import { User } from "../domain/user";
import { IUserRepository } from "./interfaces/user-repository.interface";

@injectable()
export class UserRepository extends Repository<User> implements IUserRepository {

  findByEmail(email: string): Promise<User | null> {
    return this.findOne({ where: { email } });
  }

}