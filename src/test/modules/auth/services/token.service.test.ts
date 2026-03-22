import "reflect-metadata";
import { TokenService } from "../../../../modules/auth/services/token.service";
import decodeJwt from "jsonwebtoken";

describe("TokenService", () => {
  let service: TokenService;

  beforeEach(() => {
    service = new TokenService();
  });

  describe("generateToken", () => {
    it("deve gerar um token válido", () => {
      // Arrange
      const userId = "uuid-123";

      // Act
      const token = service.generateToken(userId);

      // Assert
      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
    });

    it("deve gerar tokens diferentes para diferentes user IDs", () => {
      // Arrange
      const userId1 = "uuid-123";
      const userId2 = "uuid-456";

      // Act
      const token1 = service.generateToken(userId1);
      const token2 = service.generateToken(userId2);

      // Assert
      expect(token1).not.toBe(token2);
    });

    it("deve gerar um formato JWT válido", () => {
      // Arrange
      const userId = "uuid-123";

      // Act
      const token = service.generateToken(userId);

      // Assert
      const parts = token.split(".");
      expect(parts.length).toBe(3); // JWT tem 3 partes: header.payload.signature
    });
  });
});