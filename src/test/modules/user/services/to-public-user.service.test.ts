import { ToPublicUserService } from "../../../../modules/user/services/to-public-user.service";
import { User } from "../../../../modules/user/domain/user";

describe("ToPublicUserService", () => {
  let service: ToPublicUserService;

  beforeEach(() => {
    service = new ToPublicUserService();
  });

  describe("execute", () => {
    it("deve converter um usuário para formato público", () => {
      // Arrange
      const mockUser = {
        id: "uuid-123",
        name: "João Silva",
        email: "joao@example.com",
        passwordHash: "hashed-password-secret",
      } as User;

      // Act
      const result = service.execute(mockUser);

      // Assert
      expect(result).toEqual({
        id: "uuid-123",
        name: "João Silva",
        email: "joao@example.com",
      });
    });

    it("não deve incluir campo passwordHash na resposta pública", () => {
      // Arrange
      const mockUser = {
        id: "uuid-456",
        name: "Maria Santos",
        email: "maria@example.com",
        passwordHash: "super-secret-hashed",
      } as User;

      // Act
      const result = service.execute(mockUser);

      // Assert
      expect(result).not.toHaveProperty("passwordHash");
    });

    it("deve incluir apenas id, name e email", () => {
      // Arrange
      const mockUser = {
        id: "uuid-999",
        name: "Ana Costa",
        email: "ana@example.com",
        passwordHash: "hashed",
      } as User;

      // Act
      const result = service.execute(mockUser);

      // Assert
      expect(Object.keys(result).sort()).toEqual(["email", "id", "name"]);
    });
  });
});