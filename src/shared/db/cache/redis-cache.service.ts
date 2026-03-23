import { createClient, RedisClientType } from "redis";
import { injectable } from "tsyringe";
import { REDIS_CONFIG } from "../config/redis.config";
import { ICacheService } from "./interfaces/cache-service.interface";
import { logger } from "../../utils/logger";

@injectable()
export class RedisCacheService implements ICacheService {
  private client: RedisClientType | null = null;
  private isConnected = false;

  constructor() {
    if (REDIS_CONFIG.enabled) {
      this.initialize();
    }
  }

  private async initialize(): Promise<void> {
    try {
      this.client = createClient({
        host: REDIS_CONFIG.connection.host,
        port: REDIS_CONFIG.connection.port,
        password: REDIS_CONFIG.connection.password,
        db: REDIS_CONFIG.connection.db,
        socket: {
          reconnectStrategy: (retries: number) => {
            const delay = Math.min(
              REDIS_CONFIG.retry.retryDelayBase *
                Math.pow(2, retries),
              REDIS_CONFIG.retry.retryDelayMax
            );
            return delay;
          },
        },
      } as any);

      this.client.on("error", (err) => {
        logger.error(`[RedisCache] Erro de conexão: ${err.message}`);
      });

      this.client.on("connect", () => {
        this.isConnected = true;
        logger.info("[RedisCache] Conectado ao Redis com sucesso");
      });

      this.client.on("disconnect", () => {
        this.isConnected = false;
        logger.warn("[RedisCache] Desconectado do Redis");
      });

      await this.client.connect();
    } catch (error) {
      logger.error(
        `[RedisCache] Erro ao inicializar Redis: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      this.client = null;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.isConnected || !this.client) {
      return null;
    }

    try {
      const value = await this.client.get(key);
      if (!value) {
        return null;
      }

      return JSON.parse(value) as T;
    } catch (error) {
      logger.error(
        `[RedisCache] Erro ao obter chave ${key}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    if (!this.isConnected || !this.client) {
      return;
    }

    try {
      const serializedValue = JSON.stringify(value);
      const finalTTL = ttl || REDIS_CONFIG.defaultTTL;

      if (finalTTL > 0) {
        await this.client.setEx(key, finalTTL, serializedValue);
      } else {
        await this.client.set(key, serializedValue);
      }

      logger.debug(`[RedisCache] Chave ${key} armazenada com TTL ${finalTTL}s`);
    } catch (error) {
      logger.error(
        `[RedisCache] Erro ao definir chave ${key}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async del(key: string | string[]): Promise<void> {
    if (!this.isConnected || !this.client) {
      return;
    }

    try {
      const keys = Array.isArray(key) ? key : [key];
      if (keys.length > 0) {
        await this.client.del(keys);
        logger.debug(`[RedisCache] ${keys.length} chave(s) deletada(s)`);
      }
    } catch (error) {
      logger.error(
        `[RedisCache] Erro ao deletar chave(s): ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async delByPattern(pattern: string): Promise<void> {
    if (!this.isConnected || !this.client) {
      return;
    }

    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.del(keys);
        logger.debug(
          `[RedisCache] ${keys.length} chave(s) deletada(s) com padrão ${pattern}`
        );
      }
    } catch (error) {
      logger.error(
        `[RedisCache] Erro ao deletar padrão ${pattern}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async exists(key: string): Promise<boolean> {
    if (!this.isConnected || !this.client) {
      return false;
    }

    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      logger.error(
        `[RedisCache] Erro ao verificar existência de ${key}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      return false;
    }
  }

  async ttl(key: string): Promise<number> {
    if (!this.isConnected || !this.client) {
      return -2;
    }

    try {
      return await this.client.ttl(key);
    } catch (error) {
      logger.error(
        `[RedisCache] Erro ao obter TTL de ${key}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      return -2;
    }
  }

  async flush(): Promise<void> {
    if (!this.isConnected || !this.client) {
      return;
    }

    try {
      await this.client.flushDb();
      logger.warn("[RedisCache] Base de dados Redis limpa");
    } catch (error) {
      logger.error(
        `[RedisCache] Erro ao limpar Redis: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async disconnect(): Promise<void> {
    if (this.client && this.isConnected) {
      await this.client.disconnect();
      this.isConnected = false;
      logger.info("[RedisCache] Desconectado do Redis");
    }
  }
}
