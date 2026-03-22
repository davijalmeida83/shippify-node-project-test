import "reflect-metadata";
import { GetAllUsersService } from "../../../../modules/user/services/get-all-users.service";
import { IUserFinder } from "../../../../modules/user/repositories/interfaces/user-finder.interface";
import { ToPublicUserService } from "../../../../modules/user/services/to-public-user.service";
import { User } from "../../../../modules/user/domain/user";

describe("GetAllUsersService", () => {
  let service: GetAllUsersService;
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

    service = new GetAllUsersService(userFinderMock, toPublicUserServiceMock);
  });

  describe("execute", () => {
    it("deve retornar todos os usuários em formato público", async () => {
      // Arrange
      const mockUsers = [
        {
          id: "uuid-1",
          name: "João Silva",
          email: "joao@example.com",
          passwordHash: "hashed",
        } as User,
        {
          id: "uuid-2",
          name: "Maria Santos",
          email: "maria@example.com",
          passwordHash: "hashed",
        } as User,
      ];

      const publicUsers = [
        { id: "uuid-1", name: "João Silva", email: "joao@example.com" },
        { id: "uuid-2", name: "Maria Santos", email: "maria@example.com" },
      ];

      userFinderMock.findAll.mockResolvedValue(mockUsers);
      toPublicUserServiceMock.execute
        .mockReturnValueOnce(publicUsers[0])
        .mockReturnValueOnce(publicUsers[1]);

      // Act
      const result = await service.execute();

      // Assert
      expect(result).toEqual(publicUsers);
      expect(userFinderMock.findAll).toHaveBeenCalled();
      expect(toPublicUserServiceMock.execute).toHaveBeenCalledTimes(2);
    });

    it("deve retornar lista vazia quando não há usuários", async () => {
      // Arrange
      userFinderMock.findAll.mockResolvedValue([]);

      // Act
      const result = await service.execute();

      // Assert
      expect(result).toEqual([]);
      expect(userFinderMock.findAll).toHaveBeenCalled();
      expect(toPublicUserServiceMock.execute).not.toHaveBeenCalled();
    });

    it("deve mapear todos os usuários para formato público", async () => {
      // Arrange
      const mockUsers = [
        {
          id: "uuid-1",
          name: "User 1",
          email: "user1@example.com",
          passwordHash: "hashed",
        } as User,
      ];

      const publicUser = {
        id: "uuid-1",
        name: "User 1",
        email: "user1@example.com",
      };

      userFinderMock.findAll.mockResolvedValue(mockUsers);
      toPublicUserServiceMock.execute.mockReturnValue(publicUser);

      // Act
      await service.execute();

      // Assert
      expect(toPublicUserServiceMock.execute).toHaveBeenCalledWith(mockUsers[0]);
    });
  });
});
