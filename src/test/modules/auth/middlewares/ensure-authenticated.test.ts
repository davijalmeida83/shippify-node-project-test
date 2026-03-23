import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { ensureAuthenticated } from "../../../../modules/auth/middlewares/ensure-authenticated";
import { AppError } from "../../../../shared/errors/app-error";

jest.mock("jsonwebtoken");

describe("ensureAuthenticated Middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {};
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("when token is missing", () => {
    it("should throw error if no authorization header", () => {
      // Arrange
      req.headers = {};

      // Act & Assert
      expect(() => {
        ensureAuthenticated(req as Request, res as Response, next);
      }).toThrow(AppError);
      expect(() => {
        ensureAuthenticated(req as Request, res as Response, next);
      }).toThrow("JWT token is missing");
    });

    it("should throw error if authorization header is empty string", () => {
      // Arrange
      req.headers = {
        authorization: "",
      };

      // Act & Assert
      expect(() => {
        ensureAuthenticated(req as Request, res as Response, next);
      }).toThrow("JWT token is missing");
    });
  });

  describe("when token is invalid", () => {
    it("should throw error for invalid JWT token", () => {
      // Arrange
      const invalidToken = "invalid.jwt.token";
      req.headers = {
        authorization: `Bearer ${invalidToken}`,
      };
      (verify as jest.Mock).mockImplementation(() => {
        throw new Error("Invalid token");
      });

      // Act & Assert
      expect(() => {
        ensureAuthenticated(req as Request, res as Response, next);
      }).toThrow(AppError);
      expect(() => {
        ensureAuthenticated(req as Request, res as Response, next);
      }).toThrow("Invalid JWT token");
    });

    it("should throw error for expired JWT token", () => {
      // Arrange
      const expiredToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.expired";
      req.headers = {
        authorization: `Bearer ${expiredToken}`,
      };
      (verify as jest.Mock).mockImplementation(() => {
        throw new Error("TokenExpiredError");
      });

      // Act & Assert
      expect(() => {
        ensureAuthenticated(req as Request, res as Response, next);
      }).toThrow("Invalid JWT token");
    });
  });

  describe("when token is valid", () => {
    it("should attach user id to request and call next", () => {
      // Arrange
      const userId = "user-uuid-123";
      const validToken = "valid.jwt.token";
      req.headers = {
        authorization: `Bearer ${validToken}`,
      };

      (verify as jest.Mock).mockReturnValue({
        sub: userId,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      });

      // Act
      ensureAuthenticated(req as Request, res as Response, next);

      // Assert
      expect(req.user).toEqual({ id: userId });
      expect(next).toHaveBeenCalled();
      expect(verify).toHaveBeenCalledWith(validToken, expect.any(String));
    });

    it("should handle different token formats with Bearer prefix", () => {
      // Arrange
      const userId = "another-user-uuid";
      const token = "token.with.Bearer";
      req.headers = {
        authorization: `Bearer ${token}`,
      };

      (verify as jest.Mock).mockReturnValue({
        sub: userId,
        iat: 1234567890,
        exp: 1234571490,
      });

      // Act
      ensureAuthenticated(req as Request, res as Response, next);

      // Assert
      expect(req.user?.id).toBe(userId);
      expect(next).toHaveBeenCalled();
    });

    it("should extract user id from token payload", () => {
      // Arrange
      const userId = "test-user-id";
      const token = "test.token";
      req.headers = {
        authorization: `Bearer ${token}`,
      };

      (verify as jest.Mock).mockReturnValue({
        sub: userId,
        iat: 1000000000,
        exp: 2000000000,
      });

      // Act
      ensureAuthenticated(req as Request, res as Response, next);

      // Assert
      expect(req.user).toBeDefined();
      expect(req.user?.id).toBe(userId);
      expect(next).toHaveBeenCalledTimes(1);
    });
  });

  describe("edge cases", () => {
    it("should handle authorization header with multiple spaces", () => {
      // Arrange
      const token = "test.token";
      req.headers = {
        authorization: `Bearer  ${token}`,
      };

      (verify as jest.Mock).mockReturnValue({
        sub: "user-id",
        iat: 1000000000,
        exp: 2000000000,
      });

      // Act
      ensureAuthenticated(req as Request, res as Response, next);

      // Assert
      expect(next).toHaveBeenCalled();
    });

    it("should verify token with correct secret", () => {
      // Arrange
      const token = "token.to.verify";
      const userId = "verified-user";
      req.headers = {
        authorization: `Bearer ${token}`,
      };

      (verify as jest.Mock).mockReturnValue({
        sub: userId,
        iat: 1000000000,
        exp: 2000000000,
      });

      // Act
      ensureAuthenticated(req as Request, res as Response, next);

      // Assert
      expect(verify).toHaveBeenCalledWith(token, expect.any(String));
      expect(next).toHaveBeenCalled();
    });
  });
});
