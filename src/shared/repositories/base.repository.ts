import { Repository, ObjectLiteral } from "typeorm";
import { AppDataSource } from "../db/config/typeorm.config";

export abstract class BaseRepository<T extends ObjectLiteral> extends Repository<T> {
  constructor(entity: new () => T) {
    super(entity, AppDataSource.manager);
  }
}
