import "reflect-metadata";
import { RegisterService } from "../../../../modules/user/services/register.service";
import { IUserFinder } from "../../../../modules/user/repositories/interfaces/user-finder.interface";
import { IUserPersistence } from "../../../../modules/user/repositories/interfaces/user-persistence.interface";
import { TokenService } from "../../../../modules/auth/services/token.service";
import { ToPublicUserService } from "../../../../modules/user/services/to-public-user.service";
import { AppError } from "../../../../shared/errors/app-error";
import { User } from "../../../../modules/user/domain/user";

describe("RegisterService", () => {
  let service: RegisterService;
  let userFinderMock: jest.Mocked<IUserFinder>;
  let userPersistenceMock: jest.Mocked<IUserPersistence>;
  let tokenServiceMock: jest.Mocked<TokenService>;
  let toPublicUserServiceMock: jest.Mocked<ToPublicUserService>;

  beforeEach(() => {
    userFinderMock = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
    };

    userPersistenceMock = {
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    tokenServiceMock = {
      generateToken: jest.fn(),
      validateToken: jest.fn(),
    } as any;

    toPublicUserServiceMock = {
      execute: jest.fn(),
    } as any;

    service = new RegisterService(
      userFinderMock,
      userPersistenceMock,
      toPublicUserServiceMock,
      tokenServiceMock
    );
  });

  describe("execute", () => {
    const mockUserInput = {
      name: "João Silva",
      email: "joao@example.com",
      password: "senha123456",
    };

    const mockUser = {
      id: "uuid-123",
      name: "João Silva",
      email: "joao@example.com",
      passwordHash: "hashed-password",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;

    const mockPublicUser = {
      id: "uuid-123",
      name: "João Silva",
      email: "joao@example.com",
    };

    it("deve registrar um novo usuário com sucesso", async () => {
      userFinderMock.findByEmail.mockResolvedValue(null);
      userPersistenceMock.create.mockReturnValue(mockUser);
      userPersistenceMock.save.mockResolvedValue(mockUser);
      tokenServiceMock.generateToken.mockReturnValue("jwt-token-123");
      toPublicUserServiceMock.execute.mockReturnValue(mockPublicUser);

      const result = await service.execute(mockUserInput);

      expect(result).toEqual({
        token: "jwt-token-123",
        user: mockPublicUser,
      });
      expect(userFinderMock.findByEmail).toHaveBeenCalledWith("joao@example.com");
      expect(userPersistenceMock.save).toHaveBeenCalledWith(mockUser);
    });

    it("deve lançar erro se o email já existir", async () => {
      const existingUser = { ...mockUser, id: "uuid-456" };
      userFinderMock.findByEmail.mockResolvedValue(existingUser);

      await expect(service.execute(mockUserInput)).rejects.toThrow(
        "User already exists"
      );
    });

    it("deve normalizar email para lowercase", async () => {
      const inputWithUpperCase = {
        ...mockUserInput,
        email: "JOAO@EXAMPLE.COM",
      };

      userFinderMock.findByEmail.mockResolvedValue(null);
      userPersistenceMock.create.mockReturnValue(mockUser);
      userPersistenceMock.save.mockResolvedValue(mockUser);
      tokenServiceMock.generateToken.mockReturnValue("token");
      toPublicUserServiceMock.execute.mockReturnValue(mockPublicUser);

      await service.execute(inputWithUpperCase);

      expect(userFinderMock.findByEmail).toHaveBeenCalledWith("joao@example.com");
    });

    it("deve trimizar nome e email", async () => {
      const inputWithSpaces = {
        name: "  João Silva  ",
        email: "  joao@example.com  ",
        password: "senha123456",
      };

      userFinderMock.findByEmail.mockResolvedValue(null);
      userPersistenceMock.create.mockReturnValue(mockUser);
      userPersistenceMock.save.mockResolvedValue(mockUser);
      tokenServiceMock.generateToken.mockReturnValue("token");
      toPublicUserServiceMock.execute.mockReturnValue(mockPublicUser);

      await service.execute(inputWithSpaces);

      expect(userFinderMock.findByEmail).toHaveBeenCalledWith("joao@example.com");
    });
  });
});