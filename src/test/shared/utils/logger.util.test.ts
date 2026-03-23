import { logger } from "../../../shared/utils/logger";

describe("Logger Util", () => {
  let consoleInfoSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleInfoSpy = jest.spyOn(console, "info").mockImplementation();
    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
  });

  afterEach(() => {
    consoleInfoSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe("info", () => {
    it("should log info message with [INFO] prefix", () => {
      // Act
      logger.info("Application started");

      // Assert
      expect(consoleInfoSpy).toHaveBeenCalledWith("[INFO]: Application started");
    });

    it("should log info message with additional parameters", () => {
      // Arrange
      const userId = 123;
      const action = "login";

      // Act
      logger.info("User action", { userId, action });

      // Assert
      expect(consoleInfoSpy).toHaveBeenCalledWith(
        "[INFO]: User action",
        { userId, action }
      );
    });

    it("should log info message with multiple optional parameters", () => {
      // Arrange
      const param1 = { key: "value" };
      const param2 = "string param";
      const param3 = 42;

      // Act
      logger.info("Complex log", param1, param2, param3);

      // Assert
      expect(consoleInfoSpy).toHaveBeenCalledWith(
        "[INFO]: Complex log",
        param1,
        param2,
        param3
      );
    });

    it("should handle empty optional parameters", () => {
      // Act
      logger.info("Message without params");

      // Assert
      expect(consoleInfoSpy).toHaveBeenCalledWith("[INFO]: Message without params");
    });

    it("should handle special characters in message", () => {
      // Act
      logger.info("Special chars: !@#$%^&*()");

      // Assert
      expect(consoleInfoSpy).toHaveBeenCalledWith("[INFO]: Special chars: !@#$%^&*()");
    });
  });

  describe("warn", () => {
    it("should log warn message with [WARN] prefix", () => {
      // Act
      logger.warn("Deprecation warning");

      // Assert
      expect(consoleWarnSpy).toHaveBeenCalledWith("[WARN]: Deprecation warning");
    });

    it("should log warn message with additional parameters", () => {
      // Arrange
      const deprecated = "oldFunction";
      const replacement = "newFunction";

      // Act
      logger.warn("Function deprecated", { deprecated, replacement });

      // Assert
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "[WARN]: Function deprecated",
        { deprecated, replacement }
      );
    });

    it("should log warn message with multiple optional parameters", () => {
      // Arrange
      const errorContext = { code: 500 };
      const timestamp = new Date();

      // Act
      logger.warn("Warning occurred", errorContext, timestamp);

      // Assert
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "[WARN]: Warning occurred",
        errorContext,
        timestamp
      );
    });

    it("should handle empty optional parameters", () => {
      // Act
      logger.warn("Warning message only");

      // Assert
      expect(consoleWarnSpy).toHaveBeenCalledWith("[WARN]: Warning message only");
    });

    it("should handle array as optional parameter", () => {
      // Arrange
      const items = [1, 2, 3, 4, 5];

      // Act
      logger.warn("Multiple items", items);

      // Assert
      expect(consoleWarnSpy).toHaveBeenCalledWith("[WARN]: Multiple items", items);
    });
  });

  describe("error", () => {
    it("should log error message with [ERROR] prefix", () => {
      // Act
      logger.error("Database connection failed");

      // Assert
      expect(consoleErrorSpy).toHaveBeenCalledWith("[ERROR]: Database connection failed");
    });

    it("should log error message with error object as parameter", () => {
      // Arrange
      const error = new Error("Something went wrong");

      // Act
      logger.error("An error occurred", error);

      // Assert
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "[ERROR]: An error occurred",
        error
      );
    });

    it("should log error message with error context and stack", () => {
      // Arrange
      const context = {
        endpoint: "/api/users",
        method: "POST",
      };
      const stack = "Error: at Function.js:10:5";

      // Act
      logger.error("API error", context, stack);

      // Assert
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "[ERROR]: API error",
        context,
        stack
      );
    });

    it("should handle empty optional parameters", () => {
      // Act
      logger.error("Critical error");

      // Assert
      expect(consoleErrorSpy).toHaveBeenCalledWith("[ERROR]: Critical error");
    });

    it("should handle multiple optional parameters for error logging", () => {
      // Arrange
      const errorCode = "E001";
      const timestamp = new Date().toISOString();
      const userId = "user-123";

      // Act
      logger.error("User action failed", errorCode, timestamp, userId);

      // Assert
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "[ERROR]: User action failed",
        errorCode,
        timestamp,
        userId
      );
    });

    it("should handle null as optional parameter", () => {
      // Act
      logger.error("Error with null context", null);

      // Assert
      expect(consoleErrorSpy).toHaveBeenCalledWith("[ERROR]: Error with null context", null);
    });

    it("should handle undefined as optional parameter", () => {
      // Act
      logger.error("Error with undefined", undefined);

      // Assert
      expect(consoleErrorSpy).toHaveBeenCalledWith("[ERROR]: Error with undefined", undefined);
    });
  });

  describe("Logger consistency", () => {
    it("should use consistent [PREFIX]: format across all methods", () => {
      // Act
      logger.info("Info message");
      logger.warn("Warn message");
      logger.error("Error message");

      // Assert
      expect(consoleInfoSpy).toHaveBeenCalledWith("[INFO]: Info message");
      expect(consoleWarnSpy).toHaveBeenCalledWith("[WARN]: Warn message");
      expect(consoleErrorSpy).toHaveBeenCalledWith("[ERROR]: Error message");
    });

    it("should preserve parameter order in all methods", () => {
      // Arrange
      const param1 = "first";
      const param2 = { second: "object" };
      const param3 = 123;

      // Act
      logger.info("Test", param1, param2, param3);
      logger.warn("Test", param1, param2, param3);
      logger.error("Test", param1, param2, param3);

      // Assert
      expect(consoleInfoSpy).toHaveBeenCalledWith("[INFO]: Test", param1, param2, param3);
      expect(consoleWarnSpy).toHaveBeenCalledWith("[WARN]: Test", param1, param2, param3);
      expect(consoleErrorSpy).toHaveBeenCalledWith("[ERROR]: Test", param1, param2, param3);
    });

    it("should all methods call their respective console methods", () => {
      // Act
      logger.info("Info");
      logger.warn("Warn");
      logger.error("Error");

      // Assert
      expect(consoleInfoSpy).toHaveBeenCalled();
      expect(consoleWarnSpy).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe("Logger edge cases", () => {
    it("should handle very long messages", () => {
      // Arrange
      const longMessage = "A".repeat(1000);

      // Act
      logger.info(longMessage);

      // Assert
      expect(consoleInfoSpy).toHaveBeenCalledWith(`[INFO]: ${longMessage}`);
    });

    it("should handle messages with newlines", () => {
      // Act
      logger.error("Error message\nwith newlines");

      // Assert
      expect(consoleErrorSpy).toHaveBeenCalledWith("[ERROR]: Error message\nwith newlines");
    });

    it("should handle complex nested objects", () => {
      // Arrange
      const complexObject = {
        level1: {
          level2: {
            level3: {
              data: [1, 2, 3],
              status: "nested",
            },
          },
        },
      };

      // Act
      logger.warn("Complex object", complexObject);

      // Assert
      expect(consoleWarnSpy).toHaveBeenCalledWith("[WARN]: Complex object", complexObject);
    });

    it("should handle circular references safely", () => {
      // Arrange
      const obj: any = {};
      obj.self = obj;

      // Act & Assert - should not throw
      expect(() => {
        logger.info("Circular reference", obj);
      }).not.toThrow();
    });
  });
});
