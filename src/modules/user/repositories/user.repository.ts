import { injectable } from "tsyringe";
import { Repository } from "typeorm";
import { User } from "../domain/user";
import { IUserRepository } from "./interfaces/user-repository.interface";
import { AppDataSource } from "../../../shared/db/config/typeorm.config";

const userRepository = AppDataSource.getRepository(User);

@injectable()
export class UserRepository extends Repository<User> implements IUserRepository {

  findByEmail(email: string): Promise<User | null> {
    return this.findOne({ where: { email } });
  }

}