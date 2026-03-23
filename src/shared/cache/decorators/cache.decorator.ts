import { container } from "tsyringe";
import { ICacheService } from "../interfaces/cache-service.interface";
import { REDIS_CONFIG } from "../../config/redis.config";
import { logger } from "../../utils/logger";

/**
 * Opções para o decorador de cache
 */
export interface CacheOptions {
  /**
   * Chave do cache (pode usar :param para interpolação de parâmetros)
   * Ex: "user:{{0}}" para usar primeiro parâmetro
   */
  key: string;

  /**
   * TTL em segundos (usa padrão se não fornecido)
   */
  ttl?: number;

  /**
   * Invalidar cache quando esse método é chamado
   */
  invalidate?: string | string[];

  /**
   * Condicional: função que retorna se deve usar cache
   */
  condition?: (...args: any[]) => boolean;
}

/**
 * Decorador para cache com Redis
 * Armazena resultado de métodos no Redis com TTL configurável
 *
 * @example
 * @Cached({
 *   key: "user:{{0}}",
 *   ttl: REDIS_CONFIG.ttl.user
 * })
 * async getUser(id: string): Promise<User> {
 *   return this.userRepository.findOne(id);
 * }
 */
export function Cached(options: CacheOptions) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      // Verificar condição
      if (options.condition && !options.condition(...args)) {
        return originalMethod.apply(this, args);
      }

      try {
        const cacheService = container.resolve<ICacheService>("CacheService");

        // Gerar chave interpolada
        const cacheKey = interpolateKey(options.key, args);

        // Tentar obter do cache
        const cachedValue = await cacheService.get(cacheKey);
        if (cachedValue !== null) {
          logger.debug(`[Cache] HIT: ${cacheKey}`);
          return cachedValue;
        }

        logger.debug(`[Cache] MISS: ${cacheKey}`);
      } catch (error) {
        logger.warn(
          `[Cache] Erro ao acessar cache: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }

      // Executar método original
      const result = await originalMethod.apply(this, args);

      // Armazenar no cache
      try {
        const cacheService = container.resolve<ICacheService>("CacheService");
        const cacheKey = interpolateKey(options.key, args);
        const ttl = options.ttl || REDIS_CONFIG.defaultTTL;

        await cacheService.set(cacheKey, result, ttl);

        logger.debug(`[Cache] STORED: ${cacheKey} (TTL: ${ttl}s)`);
      } catch (error) {
        logger.warn(
          `[Cache] Erro ao armazenar cache: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }

      return result;
    };

    return descriptor;
  };
}

/**
 * Decorador para invalidar cache
 * Remove chaves de cache após a execução do método
 *
 * @example
 * @InvalidateCache("user:*")
 * async updateUser(id: string): Promise<void> {
 *   // Atualizar usuário
 * }
 */
export function InvalidateCache(patterns: string | string[]) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      // Executar método original
      const result = await originalMethod.apply(this, args);

      // Invalidar cache
      try {
        const cacheService = container.resolve<ICacheService>("CacheService");
        const patternList = Array.isArray(patterns) ? patterns : [patterns];

        for (const pattern of patternList) {
          const interpolatedPattern = interpolateKey(pattern, args);
          await cacheService.delByPattern(interpolatedPattern);
          logger.debug(`[Cache] INVALIDATED: ${interpolatedPattern}`);
        }
      } catch (error) {
        logger.warn(
          `[Cache] Erro ao invalidar cache: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }

      return result;
    };

    return descriptor;
  };
}

/**
 * Interpolar chave com parâmetros
 * Suporta {{index}} para referência de parâmetros
 *
 * @example
 * interpolateKey("user:{{0}}", ["123"]) // "user:123"
 * interpolateKey("user:{{0}}:posts:{{1}}", ["123", "456"]) // "user:123:posts:456"
 */
function interpolateKey(key: string, args: any[]): string {
  let result = key;

  for (let i = 0; i < args.length; i++) {
    const pattern = new RegExp(`\\{\\{${i}\\}\\}`, "g");
    result = result.replace(pattern, String(args[i]));
  }

  return result;
}
