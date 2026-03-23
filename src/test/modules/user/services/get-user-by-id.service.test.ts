import "reflect-metadata";
import { GetUserByIdService } from "../../../../modules/user/services/get-user-by-id.service";
import { IUserFinder } from "../../../../modules/user/repositories/interfaces/user-finder.interface";
import { ToPublicUserService } from "../../../../modules/user/services/to-public-user.service";
import { AppError } from "../../../../shared/errors/app-error";
import { User } from "../../../../modules/user/domain/user";

describe("GetUserByIdService", () => {
  let service: GetUserByIdService;
  let userFinderMock: jest.Mocked<IUserFinder>;
  let toPublicUserServiceMock: jest.Mocked<ToPublicUserService>;

  beforeEach(() => {
    userFinderMock = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
    };

    toPublicUserServiceMock = {
      execute: jest.fn(),
    } as any;

    service = new GetUserByIdService(userFinderMock, toPublicUserServiceMock);
  });

  describe("execute", () => {
    const userId = "uuid-123";
    const mockUser = {
      id: userId,
      name: "João Silva",
      email: "joao@example.com",
      passwordHash: "hashed-password",
    } as User;

    const publicUser = {
      id: userId,
      name: "João Silva",
      email: "joao@example.com",
    };

    it("deve retornar usuário encontrado em formato público", async () => {
      // Arrange
      userFinderMock.findById.mockResolvedValue(mockUser);
      toPublicUserServiceMock.execute.mockReturnValue(publicUser);

      // Act
      const result = await service.execute(userId);

      // Assert
      expect(result).toEqual(publicUser);
      expect(userFinderMock.findById).toHaveBeenCalledWith(userId);
      expect(toPublicUserServiceMock.execute).toHaveBeenCalledWith(mockUser);
    });

    it("deve lançar erro se usuário não for encontrado", async () => {
      // Arrange
      userFinderMock.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.execute(userId)).rejects.toThrow(AppError);
      await expect(service.execute(userId)).rejects.toThrow("User not found");
    });

    it("deve chamar findById com o ID correto", async () => {
      // Arrange
      const testId = "test-uuid-456";
      userFinderMock.findById.mockResolvedValue(mockUser);
      toPublicUserServiceMock.execute.mockReturnValue(publicUser);

      // Act
      await service.execute(testId);

      // Assert
      expect(userFinderMock.findById).toHaveBeenCalledWith(testId);
      expect(userFinderMock.findById).toHaveBeenCalledTimes(1);
    });

    it("deve converter usuário encontrado para formato público", async () => {
      // Arrange
      userFinderMock.findById.mockResolvedValue(mockUser);
      toPublicUserServiceMock.execute.mockReturnValue(publicUser);

      // Act
      const result = await service.execute(userId);

      // Assert
      expect(toPublicUserServiceMock.execute).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(publicUser);
    });
  });
});
