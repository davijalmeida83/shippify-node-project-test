import "reflect-metadata";
import { LoginService } from "../../../../modules/auth/services/login.service";
import { TokenService } from "../../../../modules/auth/services/token.service";
import { ToPublicUserService } from "../../../../modules/user/services/to-public-user.service";
import { IUserFinder } from "../../../../modules/user/repositories/interfaces/user-finder.interface";
import { AppError } from "../../../../shared/errors/app-error";
import { User } from "../../../../modules/user/domain/user";
import * as passwordUtil from "../../../../modules/auth/utils/password.util";

jest.mock("../../../../modules/auth/utils/password.util");

describe("LoginService", () => {
  let service: LoginService;
  let userFinderMock: jest.Mocked<IUserFinder>;
  let tokenServiceMock: jest.Mocked<TokenService>;
  let toPublicUserServiceMock: jest.Mocked<ToPublicUserService>;

  beforeEach(() => {
    userFinderMock = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
    };

    tokenServiceMock = {
      generateToken: jest.fn(),
      validateToken: jest.fn(),
    } as any;

    toPublicUserServiceMock = {
      execute: jest.fn(),
    } as any;

    service = new LoginService(userFinderMock, toPublicUserServiceMock, tokenServiceMock);
  });

  describe("execute", () => {
    const mockUser = {
      id: "uuid-123",
      name: "João Silva",
      email: "joao@example.com",
      passwordHash: "hashed-password",
    } as User;

    const publicUser = {
      id: "uuid-123",
      name: "João Silva",
      email: "joao@example.com",
    };

    it("deve fazer login com sucesso com credenciais válidas", async () => {
      // Arrange
      const input = {
        email: "joao@example.com",
        password: "senha123456",
      };

      userFinderMock.findByEmail.mockResolvedValue(mockUser);
      (passwordUtil.verifyPassword as jest.Mock).mockResolvedValue(true);
      tokenServiceMock.generateToken.mockReturnValue("jwt-token-123");
      toPublicUserServiceMock.execute.mockReturnValue(publicUser);

      // Act
      const result = await service.execute(input);

      // Assert
      expect(result).toEqual({
        token: "jwt-token-123",
        user: publicUser,
      });
      expect(userFinderMock.findByEmail).toHaveBeenCalledWith("joao@example.com");
      expect(passwordUtil.verifyPassword).toHaveBeenCalledWith("senha123456", mockUser.passwordHash);
    });

    it("deve lançar erro se usuário não for encontrado", async () => {
      // Arrange
      const input = {
        email: "inexistente@example.com",
        password: "senha123456",
      };

      userFinderMock.findByEmail.mockResolvedValue(null);

      // Act & Assert
      await expect(service.execute(input)).rejects.toThrow(AppError);
      await expect(service.execute(input)).rejects.toThrow("Invalid credentials");
    });

    it("deve lançar erro se a senha for inválida", async () => {
      // Arrange
      const input = {
        email: "joao@example.com",
        password: "senha-errada",
      };

      userFinderMock.findByEmail.mockResolvedValue(mockUser);
      (passwordUtil.verifyPassword as jest.Mock).mockResolvedValue(false);

      // Act & Assert
      await expect(service.execute(input)).rejects.toThrow(AppError);
      await expect(service.execute(input)).rejects.toThrow("Invalid credentials");
    });

    it("deve normalizar email para lowercase", async () => {
      // Arrange
      const input = {
        email: "JOAO@EXAMPLE.COM",
        password: "senha123456",
      };

      userFinderMock.findByEmail.mockResolvedValue(mockUser);
      (passwordUtil.verifyPassword as jest.Mock).mockResolvedValue(true);
      tokenServiceMock.generateToken.mockReturnValue("token");
      toPublicUserServiceMock.execute.mockReturnValue(publicUser);

      // Act
      await service.execute(input);

      // Assert
      expect(userFinderMock.findByEmail).toHaveBeenCalledWith("joao@example.com");
    });

    it("deve trimizar email", async () => {
      // Arrange
      const input = {
        email: "  joao@example.com  ",
        password: "senha123456",
      };

      userFinderMock.findByEmail.mockResolvedValue(mockUser);
      (passwordUtil.verifyPassword as jest.Mock).mockResolvedValue(true);
      tokenServiceMock.generateToken.mockReturnValue("token");
      toPublicUserServiceMock.execute.mockReturnValue(publicUser);

      // Act
      await service.execute(input);

      // Assert
      expect(userFinderMock.findByEmail).toHaveBeenCalledWith("joao@example.com");
    });
  });
});