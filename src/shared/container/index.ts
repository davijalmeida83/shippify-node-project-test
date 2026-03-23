import { container } from "tsyringe";
import { IUserFinder } from "../../modules/user/repositories/interfaces/user-finder.interface";
import { IUserPersistence } from "../../modules/user/repositories/interfaces/user-persistence.interface";
import { UserRepository } from "../../modules/user/repositories/user.repository";
import { USER_TOKENS } from "../../modules/user/user-tokens";
import { ToPublicUserService } from "../../modules/user/services/to-public-user.service";
import { TokenService } from "../../modules/auth/services/token.service";
import { AUTH_TOKENS } from "../../modules/auth/auth-tokens";
import { initializeDataSource } from "../db/config/typeorm.config";
import { AuditSubscriber } from '../db/subscribers/AuditSubscriber';
import { RedisCacheService } from "../cache/redis-cache.service";
import { ICacheService } from "../cache/interfaces/cache-service.interface";

export const initializeContainer = async () => {
 
  await initializeDataSource();

  container.registerSingleton<IUserFinder>(
    USER_TOKENS.UserRepository,
    UserRepository
  );

  container.registerSingleton<IUserPersistence>(
    USER_TOKENS.UserRepository,
    UserRepository
  );

  container.registerSingleton(
    USER_TOKENS.ToPublicUserService,
    ToPublicUserService
  ); 

  container.registerSingleton(
    AUTH_TOKENS.TokenService,
    TokenService
  ); 

  container.registerSingleton(AuditSubscriber);

  // Registrar serviço de cache
  container.registerSingleton<ICacheService>(
    "CacheService",
    RedisCacheService
  );

};
