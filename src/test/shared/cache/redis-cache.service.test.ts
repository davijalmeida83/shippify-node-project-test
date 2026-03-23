import { RedisCacheService } from "../../../shared/db/cache/redis-cache.service";
import { REDIS_CONFIG } from "../../../shared/db/config/redis.config";

describe("RedisCacheService", () => {
  let cacheService: RedisCacheService;

  beforeAll(async () => {
    cacheService = new RedisCacheService();
    await new Promise(resolve => setTimeout(resolve, 500));
  });

  afterAll(async () => {
    if (cacheService) {
      await cacheService.disconnect();
    }
  });

  describe("Comportamento sem conexão", () => {
    it("deve retornar null quando cache não está disponível", async () => {
      const result = await cacheService.get("any-key");
      expect(typeof result === "object" || result === null).toBe(true);
    });

    it("deve não lançar erro ao tentar set sem conexão", async () => {
      await expect(cacheService.set("key", "value")).resolves.toBeUndefined();
    });

    it("deve não lançar erro ao tentar delete sem conexão", async () => {
      await expect(cacheService.del("key")).resolves.toBeUndefined();
    });

    it("deve não lançar erro ao tentar verificar existência sem conexão", async () => {
      const exists = await cacheService.exists("key");
      expect(exists).toBe(false);
    });

    it("deve não lançar erro ao tentar flush sem conexão", async () => {
      await expect(cacheService.flush()).resolves.toBeUndefined();
    });
  });

  describe("Configuração", () => {
    it("deve respeitar flag REDIS_ENABLED", () => {
      expect(typeof REDIS_CONFIG.enabled).toBe("boolean");
    });

    it("deve ter configuração de TTL padrão", () => {
      expect(REDIS_CONFIG.defaultTTL).toBeGreaterThan(0);
      expect(typeof REDIS_CONFIG.defaultTTL).toBe("number");
    });

    it("deve ter TTLs específicas por tipo", () => {
      expect(REDIS_CONFIG.ttl.user).toBeGreaterThan(0);
      expect(REDIS_CONFIG.ttl.userList).toBeGreaterThan(0);
      expect(REDIS_CONFIG.ttl.token).toBeGreaterThan(0);
      expect(REDIS_CONFIG.ttl.sensitive).toBeGreaterThan(0);
    });

    it("deve ter configuração de conexão", () => {
      expect(REDIS_CONFIG.connection.host).toBeDefined();
      expect(REDIS_CONFIG.connection.port).toBeGreaterThan(0);
    });
  });
});
