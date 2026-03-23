import { Cached, InvalidateCache } from "../../../shared/db/cache/decorators/cache.decorator";
import { container } from "tsyringe";
import { ICacheService } from "../../../shared/db/cache/interfaces/cache-service.interface";
import { RedisCacheService } from "../../../shared/db/cache/redis-cache.service";
import { REDIS_CONFIG } from "../../../shared/db/config/redis.config";

describe("Cache Decorators", () => {
  let mockCacheService: jest.Mocked<ICacheService>;

  beforeEach(() => {
    mockCacheService = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
      delByPattern: jest.fn(),
      exists: jest.fn(),
      ttl: jest.fn(),
      flush: jest.fn(),
    };

    container.registerInstance<ICacheService>("CacheService", mockCacheService);
  });

  afterEach(() => {
    container.reset();
  });

  describe("@Cached", () => {
    it("deve obter valor do cache se existir", async () => {
      const cachedValue = { id: "1", name: "Test" };
      mockCacheService.get.mockResolvedValue(cachedValue);

      class TestService {
        @Cached({ key: "test:{{0}}" })
        async getData(id: string) {
          return { id, name: "Fresh" };
        }
      }

      const service = new TestService();
      const result = await service.getData("1");

      expect(result).toEqual(cachedValue);
      expect(mockCacheService.get).toHaveBeenCalledWith("test:1");
      expect(mockCacheService.set).not.toHaveBeenCalled();
    });

    it("deve executar método e armazenar no cache se não existir", async () => {
      mockCacheService.get.mockResolvedValue(null);

      class TestService {
        @Cached({ key: "test:{{0}}", ttl: 3600 })
        async getData(id: string) {
          return { id, name: "Fresh" };
        }
      }

      const service = new TestService();
      const result = await service.getData("1");

      expect(result).toEqual({ id: "1", name: "Fresh" });
      expect(mockCacheService.get).toHaveBeenCalledWith("test:1");
      expect(mockCacheService.set).toHaveBeenCalledWith(
        "test:1",
        { id: "1", name: "Fresh" },
        3600
      );
    });

    it("deve suportar múltiplos parâmetros na chave", async () => {
      mockCacheService.get.mockResolvedValue(null);

      class TestService {
        @Cached({ key: "user:{{0}}:post:{{1}}" })
        async getUserPost(userId: string, postId: string) {
          return { userId, postId };
        }
      }

      const service = new TestService();
      await service.getUserPost("user123", "post456");

      expect(mockCacheService.get).toHaveBeenCalledWith("user:user123:post:post456");
      expect(mockCacheService.set).toHaveBeenCalledWith(
        "user:user123:post:post456",
        { userId: "user123", postId: "post456" },
        REDIS_CONFIG.defaultTTL
      );
    });

    it("deve respeitar condição para usar cache", async () => {
      mockCacheService.get.mockResolvedValue({ cached: true });

      class TestService {
        @Cached({
          key: "test:{{0}}",
          condition: (id: string) => id !== "skip",
        })
        async getData(id: string) {
          return { id, fresh: true };
        }
      }

      const service = new TestService();

      // Com condição verdadeira - deve usar cache
      const result1 = await service.getData("1");
      expect(result1).toEqual({ cached: true });
      expect(mockCacheService.get).toHaveBeenCalled();

      // Com condição falsa - deve ignorar cache
      mockCacheService.get.mockClear();
      const result2 = await service.getData("skip");
      expect(result2).toEqual({ id: "skip", fresh: true });
      expect(mockCacheService.get).not.toHaveBeenCalled();
    });

    it("deve usar TTL padrão quando não especificado", async () => {
      mockCacheService.get.mockResolvedValue(null);

      class TestService {
        @Cached({ key: "test" })
        async getData() {
          return { test: true };
        }
      }

      const service = new TestService();
      await service.getData();

      expect(mockCacheService.set).toHaveBeenCalledWith(
        "test",
        { test: true },
        REDIS_CONFIG.defaultTTL
      );
    });
  });

  describe("@InvalidateCache", () => {
    it("deve invalidar cache com um padrão", async () => {
      class TestService {
        @InvalidateCache("user:*")
        async updateUser(id: string) {
          return { id, updated: true };
        }
      }

      const service = new TestService();
      const result = await service.updateUser("1");

      expect(result).toEqual({ id: "1", updated: true });
      expect(mockCacheService.delByPattern).toHaveBeenCalledWith("user:*");
    });

    it("deve invalidar cache com múltiplos padrões", async () => {
      class TestService {
        @InvalidateCache(["user:*", "users:list"])
        async createUser() {
          return { id: "new" };
        }
      }

      const service = new TestService();
      await service.createUser();

      expect(mockCacheService.delByPattern).toHaveBeenCalledWith("user:*");
      expect(mockCacheService.delByPattern).toHaveBeenCalledWith("users:list");
    });

    it("deve suportar interpolação de parâmetros em padrão", async () => {
      class TestService {
        @InvalidateCache("user:{{0}}:*")
        async deleteUser(id: string) {
          return { deleted: true };
        }
      }

      const service = new TestService();
      await service.deleteUser("123");

      expect(mockCacheService.delByPattern).toHaveBeenCalledWith("user:123:*");
    });

    it("deve executar método mesmo se houver erro ao invalidar", async () => {
      mockCacheService.delByPattern.mockRejectedValue(new Error("Redis error"));

      class TestService {
        @InvalidateCache("user:*")
        async updateUser(id: string) {
          return { id, updated: true };
        }
      }

      const service = new TestService();
      const result = await service.updateUser("1");

      expect(result).toEqual({ id: "1", updated: true });
    });
  });

  describe("Combinação de decoradores", () => {
    it("deve suportar @Cached e @InvalidateCache em métodos diferentes", async () => {
      mockCacheService.get.mockResolvedValue(null);

      class TestService {
        @Cached({ key: "user:{{0}}" })
        async getUser(id: string) {
          return { id, name: "User" };
        }

        @InvalidateCache("user:{{0}}")
        async updateUser(id: string) {
          return { id, updated: true };
        }
      }

      const service = new TestService();

      // Cache
      await service.getUser("1");
      expect(mockCacheService.get).toHaveBeenCalledWith("user:1");
      expect(mockCacheService.set).toHaveBeenCalledWith(
        "user:1",
        { id: "1", name: "User" },
        REDIS_CONFIG.defaultTTL
      );

      // Invalidar
      await service.updateUser("1");
      expect(mockCacheService.delByPattern).toHaveBeenCalledWith("user:1");
    });
  });
});
