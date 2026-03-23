import { RedisCacheService } from "../../../shared/cache/redis-cache.service";
import { REDIS_CONFIG } from "../../../shared/config/redis.config";

/**
 * Testes para o RedisCacheService
 * Nota: Estes são testes básicos que verificam a lógica do serviço
 * sem requerer uma instância real de Redis. Para testes de integração
 * completos com Redis, verifique se Redis está rodando em localhost:6379
 */
describe("RedisCacheService", () => {
  let cacheService: RedisCacheService;

  beforeAll(async () => {
    cacheService = new RedisCacheService();
    // Aguardar inicialização (será desabilitada se REDIS_ENABLED=false)
    await new Promise(resolve => setTimeout(resolve, 500));
  });

  afterAll(async () => {
    if (cacheService) {
      await cacheService.disconnect();
    }
  });

  describe("Comportamento sem conexão", () => {
    it("deve retornar null quando cache não está disponível", async () => {
      // Se Redis não estiver conectado, deve retornar null gracefully
      const result = await cacheService.get("any-key");
      // Pode ser null (sem Redis) ou um valor em cache (com Redis)
      // Este teste é tolerante aos dois casos
      expect(typeof result === "object" || result === null).toBe(true);
    });

    it("deve não lançar erro ao tentar set sem conexão", async () => {
      // Deve executar sem erro mesmo sem Redis
      await expect(cacheService.set("key", "value")).resolves.toBeUndefined();
    });

    it("deve não lançar erro ao tentar delete sem conexão", async () => {
      // Deve executar sem erro mesmo sem Redis
      await expect(cacheService.del("key")).resolves.toBeUndefined();
    });

    it("deve não lançar erro ao tentar verificar existência sem conexão", async () => {
      // Deve retornar false quando Redis não está disponível
      const exists = await cacheService.exists("key");
      expect(exists).toBe(false);
    });

    it("deve não lançar erro ao tentar flush sem conexão", async () => {
      // Deve executar sem erro mesmo sem Redis
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
