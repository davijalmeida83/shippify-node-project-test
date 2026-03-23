import "reflect-metadata";
import { DeleteUserService } from "../../../../modules/user/services/delete-user.service";
import { IUserFinder } from "../../../../modules/user/repositories/interfaces/user-finder.interface";
import { IUserPersistence } from "../../../../modules/user/repositories/interfaces/user-persistence.interface";

describe("DeleteUserService", () => {
  let service: DeleteUserService;
  let mockUserFinder: jest.Mocked<IUserFinder>;
  let mockUserPersistence: jest.Mocked<IUserPersistence>;

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
    service = new DeleteUserService(mockUserFinder, mockUserPersistence);
  });

  describe("execute", () => {
    it("should delete a user successfully", async () => {
      // Arrange
      const userId = "uuid-123";
      const existingUser = {
        id: userId,
        name: "João Silva",
        email: "joao@example.com",
        passwordHash: "hash123",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserFinder.findById.mockResolvedValue(existingUser);
      mockUserPersistence.delete.mockResolvedValue({ affected: 1 });

      // Act
      await service.execute(userId);

      // Assert
      expect(mockUserFinder.findById).toHaveBeenCalledWith(userId);
      expect(mockUserPersistence.delete).toHaveBeenCalledWith({ id: userId });
    });

    it("should throw error if user not found", async () => {
      // Arrange
      const userId = "non-existent-id";
      mockUserFinder.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.execute(userId)).rejects.toThrow(
        "User not found"
      );
      expect(mockUserFinder.findById).toHaveBeenCalledWith(userId);
    });

    it("should handle database errors", async () => {
      // Arrange
      const userId = "uuid-123";
      const existingUser = {
        id: userId,
        name: "João Silva",
        email: "joao@example.com",
        passwordHash: "hash123",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserFinder.findById.mockResolvedValue(existingUser);
      mockUserPersistence.delete.mockRejectedValue(
        new Error("Database error")
      );

      // Act & Assert
      await expect(service.execute(userId)).rejects.toThrow("Database error");
    });

    it("should accept valid UUID format", async () => {
      // Arrange
      const userId = "550e8400-e29b-41d4-a716-446655440000";
      const existingUser = {
        id: userId,
        name: "João Silva",
        email: "joao@example.com",
        passwordHash: "hash123",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserFinder.findById.mockResolvedValue(existingUser);
      mockUserPersistence.delete.mockResolvedValue({ affected: 1 });

      // Act
      await service.execute(userId);

      // Assert
      expect(mockUserFinder.findById).toHaveBeenCalledWith(userId);
      expect(mockUserPersistence.delete).toHaveBeenCalledWith({ id: userId });
    });
  });
});
