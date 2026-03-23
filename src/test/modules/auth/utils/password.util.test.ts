import { hashPassword, verifyPassword } from "../../../../modules/auth/utils/password.util";
import crypto from "crypto";

jest.mock("crypto");

describe("Password Util", () => {
  const mockRandomBytes = jest.fn();
  const mockScrypt = jest.fn();
  const mockTimingSafeEqual = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (crypto.randomBytes as jest.Mock) = mockRandomBytes;
    (crypto.scrypt as jest.Mock) = mockScrypt;
    (crypto.timingSafeEqual as jest.Mock) = mockTimingSafeEqual;
  });

  describe("hashPassword", () => {
    it("should hash password with random salt", async () => {
      // Arrange
      const password = "testPassword123";
      const mockSalt = Buffer.from("randomsalt");
      const mockDerivedKey = "derivedhashes";

      mockRandomBytes.mockReturnValue(mockSalt);
      mockScrypt.mockImplementation((pwd, salt, length, callback) => {
        callback(null, Buffer.from(mockDerivedKey));
      });

      // Act
      const result = await hashPassword(password);

      // Assert
      expect(result).toContain(":");
      expect(mockRandomBytes).toHaveBeenCalledWith(16);
      expect(mockScrypt).toHaveBeenCalledWith(
        password,
        mockSalt.toString("hex"),
        64,
        expect.any(Function)
      );
    });

    it("should return salt and derived key separated by colon", async () => {
      // Arrange
      const mockSalt = Buffer.from("abc123");
      const mockDerived = "hashedvalue";

      mockRandomBytes.mockReturnValue(mockSalt);
      mockScrypt.mockImplementation((pwd, salt, length, callback) => {
        callback(null, Buffer.from(mockDerived));
      });

      // Act
      const result = await hashPassword("password");
      const [salt, hash] = result.split(":");

      // Assert
      expect(salt).toBe(mockSalt.toString("hex"));
      expect(hash).toBe(Buffer.from(mockDerived).toString("hex"));
    });

    it("should reject if scrypt fails", async () => {
      // Arrange
      const mockError = new Error("Scrypt error");
      mockRandomBytes.mockReturnValue(Buffer.from("salt"));
      mockScrypt.mockImplementation((pwd, salt, length, callback) => {
        callback(mockError);
      });

      // Act & Assert
      await expect(hashPassword("password")).rejects.toThrow("Scrypt error");
    });
  });

  describe("verifyPassword", () => {
    it("should return true for matching passwords", async () => {
      // Arrange
      const password = "testPassword123";
      const salt = "testsalt";
      const mockDerivedKey = "derivedhashvalue";
      const storedHash = `${salt}:${Buffer.from(mockDerivedKey).toString("hex")}`;

      mockScrypt.mockImplementation((pwd, s, length, callback) => {
        callback(null, Buffer.from(mockDerivedKey));
      });

      mockTimingSafeEqual.mockReturnValue(true);

      // Act
      const result = await verifyPassword(password, storedHash);

      // Assert
      expect(result).toBe(true);
      expect(mockScrypt).toHaveBeenCalledWith(password, salt, 64, expect.any(Function));
      expect(mockTimingSafeEqual).toHaveBeenCalled();
    });

    it("should return false for non-matching passwords", async () => {
      // Arrange
      const password = "testPassword123";
      const salt = "testsalt";
      const mockDerivedKey = "differenthash";
      const storedHash = `${salt}:${Buffer.from("originalash").toString("hex")}`;

      mockScrypt.mockImplementation((pwd, s, length, callback) => {
        callback(null, Buffer.from(mockDerivedKey));
      });

      mockTimingSafeEqual.mockReturnValue(false);

      // Act
      const result = await verifyPassword(password, storedHash);

      // Assert
      expect(result).toBe(false);
    });

    it("should return false if stored hash is malformed", async () => {
      // Arrange
      const password = "testPassword123";
      const malformedHash = "nodots";

      // Act
      const result = await verifyPassword(password, malformedHash);

      // Assert
      expect(result).toBe(false);
      expect(mockScrypt).not.toHaveBeenCalled();
    });

    it("should return false if salt is missing", async () => {
      // Arrange
      const password = "testPassword123";
      const hashWithoutSalt = `:somehash`;

      // Act
      const result = await verifyPassword(password, hashWithoutSalt);

      // Assert
      expect(result).toBe(false);
    });

    it("should return false if hash is missing", async () => {
      // Arrange
      const password = "testPassword123";
      const hashWithoutValue = `somesalt:`;

      // Act
      const result = await verifyPassword(password, hashWithoutValue);

      // Assert
      expect(result).toBe(false);
    });

    it("should return false if buffer lengths differ", async () => {
      // Arrange
      const password = "testPassword123";
      const salt = "testsalt";
      const mockDerivedKey = "short";
      const storedHash = `${salt}:${Buffer.from("mucho_mas_long_hash_value").toString("hex")}`;

      mockScrypt.mockImplementation((pwd, s, length, callback) => {
        callback(null, Buffer.from(mockDerivedKey));
      });

      // Act
      const result = await verifyPassword(password, storedHash);

      // Assert
      expect(result).toBe(false);
      expect(mockTimingSafeEqual).not.toHaveBeenCalled();
    });

    it("should reject if scrypt fails during verification", async () => {
      // Arrange
      const password = "testPassword123";
      const storedHash = `salt:hash`;
      const mockError = new Error("Scrypt verification error");

      mockScrypt.mockImplementation((pwd, s, length, callback) => {
        callback(mockError);
      });

      // Act & Assert
      await expect(verifyPassword(password, storedHash)).rejects.toThrow("Scrypt verification error");
    });

    it("should use timingSafeEqual for hash comparison", async () => {
      // Arrange
      const password = "testPassword123";
      const salt = "testsalt";
      const mockDerivedKey = "samehash";
      const storedHash = `${salt}:${Buffer.from(mockDerivedKey).toString("hex")}`;

      mockScrypt.mockImplementation((pwd, s, length, callback) => {
        callback(null, Buffer.from(mockDerivedKey));
      });

      mockTimingSafeEqual.mockReturnValue(true);

      // Act
      await verifyPassword(password, storedHash);

      // Assert
      expect(mockTimingSafeEqual).toHaveBeenCalledWith(
        Buffer.from(storedHash.split(":")[1], "hex"),
        Buffer.from(Buffer.from(mockDerivedKey).toString("hex"), "hex")
      );
    });
  });
});
