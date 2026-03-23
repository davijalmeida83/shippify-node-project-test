import { container } from "tsyringe";
import { ICacheService } from "../interfaces/cache-service.interface";
import { REDIS_CONFIG } from "../../config/redis.config";
import { logger } from "../../../utils/logger";

export interface CacheOptions {
  key: string;

  ttl?: number;

  invalidate?: string | string[];

  condition?: (...args: any[]) => boolean;
}

export function Cached(options: CacheOptions) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      if (options.condition && !options.condition(...args)) {
        return originalMethod.apply(this, args);
      }

      try {
        const cacheService = container.resolve<ICacheService>("CacheService");
        const cacheKey = interpolateKey(options.key, args);
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

      const result = await originalMethod.apply(this, args);

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

export function InvalidateCache(patterns: string | string[]) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const result = await originalMethod.apply(this, args);

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

function interpolateKey(key: string, args: any[]): string {
  let result = key;

  for (let i = 0; i < args.length; i++) {
    const pattern = new RegExp(`\\{\\{${i}\\}\\}`, "g");
    result = result.replace(pattern, String(args[i]));
  }

  return result;
}
