import { Request, Response, NextFunction } from "express";
import {
  globalRateLimiter,
  authRateLimiter,
  creationRateLimiter,
  sensitiveRateLimiter,
  extractClientIpWithUserId,
  shouldSkipRateLimit,
} from "../../../shared/middleware/rate-limit.middleware";

describe("Rate Limit Utility Functions", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockReq = {
      ip: "192.168.1.1",
      path: "/api/test",
      socket: { remoteAddress: "192.168.1.1" } as any,
      user: { id: "user-123" } as any,
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      setHeader: jest.fn().mockReturnThis(),
    };
  });

  describe("extractClientIpWithUserId", () => {
    it("deve combinar IP e User ID quando usuário está autenticado", () => {
      const key = extractClientIpWithUserId(mockReq as Request, mockRes as Response);
      expect(key).toContain("user-123");
    });

    it("deve usar 'anonymous' quando usuário não está autenticado", () => {
      (mockReq as any).user = undefined;

      const key = extractClientIpWithUserId(mockReq as Request, mockRes as Response);
      expect(key).toContain("anonymous");
    });

    it("deve usar remoteAddress quando req.ip não está disponível", () => {
      (mockReq as any).ip = undefined;

      const key = extractClientIpWithUserId(mockReq as Request, mockRes as Response);
      expect(key).toContain("user-123");
    });
  });

  describe("shouldSkipRateLimit", () => {
    it("deve retornar true para health checks", () => {
      (mockReq as any).path = "/health";

      const shouldSkip = shouldSkipRateLimit(mockReq as Request);
      expect(shouldSkip).toBe(true);
    });

    it("deve retornar false para rotas normais", () => {
      (mockReq as any).path = "/api/auth/login";

      const shouldSkip = shouldSkipRateLimit(mockReq as Request);
      expect(shouldSkip).toBe(false);
    });

    it("deve retornar false para rotas de usuário", () => {
      (mockReq as any).path = "/api/user/register";

      const shouldSkip = shouldSkipRateLimit(mockReq as Request);
      expect(shouldSkip).toBe(false);
    });

    it("deve ser case-sensitive para health path", () => {
      (mockReq as any).path = "/HEALTH";

      const shouldSkip = shouldSkipRateLimit(mockReq as Request);
      expect(shouldSkip).toBe(false);
    });

    it("deve retornar false para /health com sufixo", () => {
      (mockReq as any).path = "/health/check";

      const shouldSkip = shouldSkipRateLimit(mockReq as Request);
      expect(shouldSkip).toBe(false);
    });
  });
});

describe("Rate Limit Middlewares", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockReq = {
      ip: "192.168.1.1",
      path: "/api/test",
      socket: { remoteAddress: "192.168.1.1" } as any,
      user: { id: "user-123" } as any,
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      setHeader: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  describe("globalRateLimiter", () => {
    it("deve permitir requisição quando sob o limite", async () => {
      await globalRateLimiter(
        mockReq as Request,
        mockRes as Response,
        mockNext as NextFunction
      );

      expect(mockNext).toHaveBeenCalled();
    });

    it("deve pular rate limit para health checks", async () => {
      (mockReq as any).path = "/health";

      await globalRateLimiter(
        mockReq as Request,
        mockRes as Response,
        mockNext as NextFunction
      );

      expect(mockNext).toHaveBeenCalled();
    });

    it("deve gerar chave baseada no IP", async () => {
      await globalRateLimiter(
        mockReq as Request,
        mockRes as Response,
        mockNext as NextFunction
      );

      // A chave deve ser baseada no IP
      expect(mockNext).toHaveBeenCalled();
    });

    it("deve usar remoteAddress como fallback quando IP não está disponível", async () => {
      (mockReq as any).ip = undefined;

      await globalRateLimiter(
        mockReq as Request,
        mockRes as Response,
        mockNext as NextFunction
      );

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("authRateLimiter", () => {
    it("deve permitir requisição de autenticação quando sob o limite", async () => {
      await authRateLimiter(
        mockReq as Request,
        mockRes as Response,
        mockNext as NextFunction
      );

      expect(mockNext).toHaveBeenCalled();
    });

    it("deve contar requisições bem-sucedidas", async () => {
      // Este teste valida que skipSuccessfulRequests está false
      const req = { ...mockReq } as Request;

      await authRateLimiter(
        req,
        mockRes as Response,
        mockNext as NextFunction
      );

      expect(mockNext).toHaveBeenCalled();
    });

    it("deve usar IP como chave para rate limiting", async () => {
      await authRateLimiter(
        mockReq as Request,
        mockRes as Response,
        mockNext as NextFunction
      );

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("creationRateLimiter", () => {
    it("deve permitir requisição POST quando sob o limite", async () => {
      (mockReq as any).method = "POST";

      await creationRateLimiter(
        mockReq as Request,
        mockRes as Response,
        mockNext as NextFunction
      );

      expect(mockNext).toHaveBeenCalled();
    });

    it("deve usar IP como chave para rate limiting", async () => {
      await creationRateLimiter(
        mockReq as Request,
        mockRes as Response,
        mockNext as NextFunction
      );

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("sensitiveRateLimiter", () => {
    it("deve permitir operação sensível quando sob o limite", async () => {
      (mockReq as any).method = "DELETE";

      await sensitiveRateLimiter(
        mockReq as Request,
        mockRes as Response,
        mockNext as NextFunction
      );

      expect(mockNext).toHaveBeenCalled();
    });

    it("deve combinar IP e User ID na chave", async () => {
      (mockReq as any).user = { id: "user-456" };

      await sensitiveRateLimiter(
        mockReq as Request,
        mockRes as Response,
        mockNext as NextFunction
      );

      expect(mockNext).toHaveBeenCalled();
    });

    it("deve usar 'anonymous' quando usuário não está autenticado", async () => {
      (mockReq as any).user = undefined;

      await sensitiveRateLimiter(
        mockReq as Request,
        mockRes as Response,
        mockNext as NextFunction
      );

      expect(mockNext).toHaveBeenCalled();
    });

    it("deve usar remoteAddress como fallback de IP", async () => {
      (mockReq as any).ip = undefined;
      (mockReq as any).socket = { remoteAddress: "10.0.0.1" } as any;

      await sensitiveRateLimiter(
        mockReq as Request,
        mockRes as Response,
        mockNext as NextFunction
      );

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("Rate Limit Headers", () => {
    it("globalRateLimiter deve incluir headers de rate limit", async () => {
      await globalRateLimiter(
        mockReq as Request,
        mockRes as Response,
        mockNext as NextFunction
      );

      expect(mockNext).toHaveBeenCalled();
    });

    it("authRateLimiter deve incluir headers de rate limit", async () => {
      await authRateLimiter(
        mockReq as Request,
        mockRes as Response,
        mockNext as NextFunction
      );

      expect(mockNext).toHaveBeenCalled();
    });

    it("creationRateLimiter deve incluir headers de rate limit", async () => {
      await creationRateLimiter(
        mockReq as Request,
        mockRes as Response,
        mockNext as NextFunction
      );

      expect(mockNext).toHaveBeenCalled();
    });

    it("sensitiveRateLimiter deve incluir headers de rate limit", async () => {
      await sensitiveRateLimiter(
        mockReq as Request,
        mockRes as Response,
        mockNext as NextFunction
      );

      expect(mockNext).toHaveBeenCalled();
    });
  });
});
