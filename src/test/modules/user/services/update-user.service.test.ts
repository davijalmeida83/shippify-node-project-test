import "reflect-metadata";
import { UpdateUserService } from "../../../../modules/user/services/update-user.service";
import { ToPublicUserService } from "../../../../modules/user/services/to-public-user.service";
import { IUserFinder } from "../../../../modules/user/repositories/interfaces/user-finder.interface";
import { IUserPersistence } from "../../../../modules/user/repositories/interfaces/user-persistence.interface";
import { User } from "../../../../modules/user/domain/user";

describe("UpdateUserService", () => {
  let service: UpdateUserService;
  let mockUserFinder: jest.Mocked<IUserFinder>;
  let mockUserPersistence: jest.Mocked<IUserPersistence>;
  let mockToPublicUserService: any;

  beforeEach(() => {
    mockUserFinder = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
    };
    mockUserPersistence = {
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    mockToPublicUserService = {
      execute: jest.fn().mockResolvedValue({}),
    } as any;
    service = new UpdateUserService(
      mockUserFinder,
      mockUserPersistence,
      mockToPublicUserService
    );
  });

  describe("execute", () => {
    it("should update user name successfully", async () => {
      // Arrange
      const userId = "uuid-123";
      const newName = "João Silva Updated";
      const existingUser = {
        id: userId,
        name: "João Silva",
        email: "joao@example.com",
        passwordHash: "hash123",
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      const expectedPublicUser = {
        id: userId,
        name: newName,
        email: "joao@example.com",
      };

      mockUserFinder.findById.mockResolvedValue(existingUser);
      mockUserPersistence.save.mockResolvedValue({ ...existingUser, name: newName });
      mockToPublicUserService.execute.mockResolvedValue(expectedPublicUser);

      // Act
      const result = await service.execute(userId, { name: newName });

      // Assert
      expect(mockUserFinder.findById).toHaveBeenCalledWith(userId);
      expect(mockUserPersistence.save).toHaveBeenCalled();
      expect(mockToPublicUserService.execute).toHaveBeenCalled();
      expect(result).toEqual(expectedPublicUser);
    });

    it("should update user email successfully", async () => {
      // Arrange
      const userId = "uuid-123";
      const newEmail = "novo@example.com";
      const existingUser = {
        id: userId,
        name: "João Silva",
        email: "joao@example.com",
        passwordHash: "hash123",
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      const expectedPublicUser = {
        id: userId,
        name: "João Silva",
        email: newEmail,
      };

      mockUserFinder.findById.mockResolvedValue(existingUser);
      mockUserFinder.findByEmail.mockResolvedValue(null);
      mockUserPersistence.save.mockResolvedValue({ ...existingUser, email: newEmail });
      mockToPublicUserService.execute.mockResolvedValue(expectedPublicUser);

      // Act
      const result = await service.execute(userId, { email: newEmail });

      // Assert
      expect(mockUserFinder.findById).toHaveBeenCalledWith(userId);
      expect(mockUserFinder.findByEmail).toHaveBeenCalledWith(newEmail);
      expect(mockUserPersistence.save).toHaveBeenCalled();
      expect(result).toEqual(expectedPublicUser);
    });

    it("should throw error if user not found", async () => {
      // Arrange
      const userId = "non-existent-id";
      mockUserFinder.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.execute(userId, { name: "New Name" })
      ).rejects.toThrow("User not found");
      expect(mockUserFinder.findById).toHaveBeenCalledWith(userId);
    });

    it("should throw error if email already exists", async () => {
      // Arrange
      const userId = "uuid-123";
      const newEmail = "taken@example.com";
      const existingUser = {
        id: userId,
        name: "João Silva",
        email: "joao@example.com",
        passwordHash: "hash123",
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;
      const otherUser = {
        id: "uuid-456",
        name: "Another User",
        email: newEmail,
        passwordHash: "hash456",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserFinder.findById.mockResolvedValue(existingUser);
      mockUserFinder.findByEmail.mockResolvedValue(otherUser);

      // Act & Assert
      await expect(
        service.execute(userId, { email: newEmail })
      ).rejects.toThrow("Email already in use");
      expect(mockUserFinder.findByEmail).toHaveBeenCalledWith(newEmail);
    });

    it("should update multiple fields at once", async () => {
      // Arrange
      const userId = "uuid-123";
      const updates = {
        name: "João Updated",
        email: "joao.novo@example.com",
      };
      const existingUser = {
        id: userId,
        name: "João Silva",
        email: "joao@example.com",
        passwordHash: "hash123",
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      const expectedPublicUser = {
        id: userId,
        name: updates.name,
        email: updates.email,
      };

      mockUserFinder.findById.mockResolvedValue(existingUser);
      mockUserFinder.findByEmail.mockResolvedValue(null);
      mockUserPersistence.save.mockResolvedValue({
        ...existingUser,
        ...updates,
      });
      mockToPublicUserService.execute.mockResolvedValue(expectedPublicUser);

      // Act
      const result = await service.execute(userId, updates);

      // Assert
      expect(result.name).toEqual(updates.name);
      expect(result.email).toEqual(updates.email);
      expect(mockUserFinder.findById).toHaveBeenCalledWith(userId);
      expect(mockUserFinder.findByEmail).toHaveBeenCalledWith(updates.email);
      expect(mockUserPersistence.save).toHaveBeenCalled();
    });

    it("should not check email if only name is updated", async () => {
      // Arrange
      const userId = "uuid-123";
      const newName = "João Updated";
      const existingUser = {
        id: userId,
        name: "João Silva",
        email: "joao@example.com",
        passwordHash: "hash123",
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      const expectedPublicUser = {
        id: userId,
        name: newName,
        email: "joao@example.com",
      };

      mockUserFinder.findById.mockResolvedValue(existingUser);
      mockUserPersistence.save.mockResolvedValue({ ...existingUser, name: newName });
      mockToPublicUserService.execute.mockResolvedValue(expectedPublicUser);

      // Act
      const result = await service.execute(userId, { name: newName });

      // Assert
      expect(mockUserFinder.findById).toHaveBeenCalledWith(userId);
      expect(mockUserFinder.findByEmail).not.toHaveBeenCalled();
      expect(mockUserPersistence.save).toHaveBeenCalled();
      expect(result).toEqual(expectedPublicUser);
    });
  });
});
