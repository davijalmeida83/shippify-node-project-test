import { logger } from "../../../shared/utils/logger";

describe("Logger Util", () => {
  let consoleInfoSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleDebugSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleInfoSpy = jest.spyOn(console, "info").mockImplementation();
    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    consoleDebugSpy = jest.spyOn(console, "debug").mockImplementation();
  });

  afterEach(() => {
    consoleInfoSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    consoleDebugSpy.mockRestore();
    delete process.env.DEBUG;
  });

  describe("info", () => {
    it("should log info message with [INFO] prefix", () => {
      logger.info("Application started");
      expect(consoleInfoSpy).toHaveBeenCalledWith("[INFO]: Application started");
    });

    it("should log info message with additional parameters", () => {
      const userId = 123;
      const action = "login";
      logger.info("User action", { userId, action });
      expect(consoleInfoSpy).toHaveBeenCalledWith(
        "[INFO]: User action",
        { userId, action }
      );
    });

    it("should log info message with multiple optional parameters", () => {
      const param1 = { key: "value" };
      const param2 = "string param";
      const param3 = 42;
      logger.info("Complex log", param1, param2, param3);
      expect(consoleInfoSpy).toHaveBeenCalledWith(
        "[INFO]: Complex log",
        param1,
        param2,
        param3
      );
    });

    it("should handle empty optional parameters", () => {
      logger.info("Message without params");
      expect(consoleInfoSpy).toHaveBeenCalledWith("[INFO]: Message without params");
    });

    it("should handle special characters in message", () => {
      logger.info("Special chars: !@#$%^&*()");
      expect(consoleInfoSpy).toHaveBeenCalledWith("[INFO]: Special chars: !@#$%^&*()");
    });
  });

  describe("warn", () => {
    it("should log warn message with [WARN] prefix", () => {
      logger.warn("Deprecation warning");
      expect(consoleWarnSpy).toHaveBeenCalledWith("[WARN]: Deprecation warning");
    });

    it("should log warn message with additional parameters", () => {
      const deprecated = "oldFunction";
      const replacement = "newFunction";
      logger.warn("Function deprecated", { deprecated, replacement });
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "[WARN]: Function deprecated",
        { deprecated, replacement }
      );
    });

    it("should log warn message with multiple optional parameters", () => {
      const errorContext = { code: 500 };
      const timestamp = new Date();
      logger.warn("Warning occurred", errorContext, timestamp);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "[WARN]: Warning occurred",
        errorContext,
        timestamp
      );
    });

    it("should handle empty optional parameters", () => {
      logger.warn("Warning message only");
      expect(consoleWarnSpy).toHaveBeenCalledWith("[WARN]: Warning message only");
    });

    it("should handle array as optional parameter", () => {
      const items = [1, 2, 3, 4, 5];
      logger.warn("Multiple items", items);
      expect(consoleWarnSpy).toHaveBeenCalledWith("[WARN]: Multiple items", items);
    });
  });

  describe("error", () => {
    it("should log error message with [ERROR] prefix", () => {
      logger.error("Database connection failed");
      expect(consoleErrorSpy).toHaveBeenCalledWith("[ERROR]: Database connection failed");
    });

    it("should log error message with error object as parameter", () => {
      const error = new Error("Something went wrong");
      logger.error("An error occurred", error);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "[ERROR]: An error occurred",
        error
      );
    });

    it("should log error message with error context and stack", () => {
      const context = {
        endpoint: "/api/users",
        method: "POST",
      };
      const stack = "Error: at Function.js:10:5";
      logger.error("API error", context, stack);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "[ERROR]: API error",
        context,
        stack
      );
    });

    it("should handle empty optional parameters", () => {
      logger.error("Critical error");
      expect(consoleErrorSpy).toHaveBeenCalledWith("[ERROR]: Critical error");
    });

    it("should handle multiple optional parameters for error logging", () => {
      const errorCode = "E001";
      const timestamp = new Date().toISOString();
      const userId = "user-123";
      logger.error("User action failed", errorCode, timestamp, userId);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "[ERROR]: User action failed",
        errorCode,
        timestamp,
        userId
      );
    });

    it("should handle null as optional parameter", () => {
      logger.error("Error with null context", null);
      expect(consoleErrorSpy).toHaveBeenCalledWith("[ERROR]: Error with null context", null);
    });

    it("should handle undefined as optional parameter", () => {
      logger.error("Error with undefined", undefined);
      expect(consoleErrorSpy).toHaveBeenCalledWith("[ERROR]: Error with undefined", undefined);
    });
  });

  describe("debug", () => {
    it("should log debug message with [DEBUG] prefix when DEBUG=true", () => {
      process.env.DEBUG = "true";
      logger.debug("Debug message");
      expect(consoleDebugSpy).toHaveBeenCalledWith("[DEBUG]: Debug message");
    });

    it("should not log debug message when DEBUG is not set", () => {
      logger.debug("Debug message");
      expect(consoleDebugSpy).not.toHaveBeenCalled();
    });

    it("should not log debug message when DEBUG is false", () => {
      process.env.DEBUG = "false";
      logger.debug("Debug message");
      expect(consoleDebugSpy).not.toHaveBeenCalled();
    });

    it("should log debug message with additional parameters when DEBUG=true", () => {
      process.env.DEBUG = "true";
      const debugData = { level: 5, context: "startup" };
      logger.debug("Initialization debug", debugData);
      expect(consoleDebugSpy).toHaveBeenCalledWith("[DEBUG]: Initialization debug", debugData);
    });

    it("should not log debug message with parameters when DEBUG is not true", () => {
      const debugData = { level: 5, context: "startup" };
      logger.debug("Initialization debug", debugData);
      expect(consoleDebugSpy).not.toHaveBeenCalled();
    });

    it("should handle multiple optional parameters when DEBUG=true", () => {
      process.env.DEBUG = "true";
      const param1 = { key: "value" };
      const param2 = "string param";
      const param3 = 42;
      logger.debug("Complex debug", param1, param2, param3);
      expect(consoleDebugSpy).toHaveBeenCalledWith(
        "[DEBUG]: Complex debug",
        param1,
        param2,
        param3
      );
    });

    it("should handle empty optional parameters when DEBUG=true", () => {
      process.env.DEBUG = "true";
      logger.debug("Message without params");
      expect(consoleDebugSpy).toHaveBeenCalledWith("[DEBUG]: Message without params");
    });

    it("should respect DEBUG environment variable dynamically", () => {
      // Initially DEBUG is not set
      logger.debug("First message");
      expect(consoleDebugSpy).not.toHaveBeenCalled();

      // Set DEBUG and test again
      consoleDebugSpy.mockClear();
      process.env.DEBUG = "true";
      logger.debug("Second message");
      expect(consoleDebugSpy).toHaveBeenCalledWith("[DEBUG]: Second message");

      // Unset DEBUG and test again
      consoleDebugSpy.mockClear();
      delete process.env.DEBUG;
      logger.debug("Third message");
      expect(consoleDebugSpy).not.toHaveBeenCalled();
    });
  });

  describe("Logger consistency", () => {
    it("should use consistent [PREFIX]: format across all methods", () => {
      process.env.DEBUG = "true";
      logger.info("Info message");
      logger.warn("Warn message");
      logger.error("Error message");
      logger.debug("Debug message");

      expect(consoleInfoSpy).toHaveBeenCalledWith("[INFO]: Info message");
      expect(consoleWarnSpy).toHaveBeenCalledWith("[WARN]: Warn message");
      expect(consoleErrorSpy).toHaveBeenCalledWith("[ERROR]: Error message");
      expect(consoleDebugSpy).toHaveBeenCalledWith("[DEBUG]: Debug message");
    });

    it("should preserve parameter order in all methods", () => {
      process.env.DEBUG = "true";
      const param1 = "first";
      const param2 = { second: "object" };
      const param3 = 123;

      logger.info("Test", param1, param2, param3);
      logger.warn("Test", param1, param2, param3);
      logger.error("Test", param1, param2, param3);
      logger.debug("Test", param1, param2, param3);

      expect(consoleInfoSpy).toHaveBeenCalledWith("[INFO]: Test", param1, param2, param3);
      expect(consoleWarnSpy).toHaveBeenCalledWith("[WARN]: Test", param1, param2, param3);
      expect(consoleErrorSpy).toHaveBeenCalledWith("[ERROR]: Test", param1, param2, param3);
      expect(consoleDebugSpy).toHaveBeenCalledWith("[DEBUG]: Test", param1, param2, param3);
    });

    it("should all methods call their respective console methods", () => {
      process.env.DEBUG = "true";
      logger.info("Info");
      logger.warn("Warn");
      logger.error("Error");
      logger.debug("Debug");

      expect(consoleInfoSpy).toHaveBeenCalled();
      expect(consoleWarnSpy).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(consoleDebugSpy).toHaveBeenCalled();
    });
  });

  describe("Logger edge cases", () => {
    it("should handle very long messages", () => {
      const longMessage = "A".repeat(1000);
      logger.info(longMessage);
      expect(consoleInfoSpy).toHaveBeenCalledWith(`[INFO]: ${longMessage}`);
    });

    it("should handle messages with newlines", () => {
      logger.info("Line 1\nLine 2\nLine 3");
      expect(consoleInfoSpy).toHaveBeenCalledWith("[INFO]: Line 1\nLine 2\nLine 3");
    });

    it("should handle empty message", () => {
      logger.info("");
      expect(consoleInfoSpy).toHaveBeenCalledWith("[INFO]: ");
    });

    it("should handle objects with special properties", () => {
      const specialObj = {
        __proto__: { dangerous: true },
        normal: "property",
        get getter() {
          return "value";
        },
      };
      logger.info("Object with special properties", specialObj);
      expect(consoleInfoSpy).toHaveBeenCalledWith(
        "[INFO]: Object with special properties",
        specialObj
      );
    });

    it("should handle circular references in objects", () => {
      const obj: any = { name: "circular" };
      obj.self = obj;
      logger.warn("Circular reference", obj);
      expect(consoleWarnSpy).toHaveBeenCalledWith("[WARN]: Circular reference", obj);
    });

    it("should handle all data types as optional parameters", () => {
      process.env.DEBUG = "true";
      const params = [
        true,
        false,
        0,
        -1,
        3.14,
        "string",
        Symbol("sym"),
        () => {},
        [],
        {},
      ];

      logger.debug("All types", ...params);

      expect(consoleDebugSpy).toHaveBeenCalledWith("[DEBUG]: All types", ...params);
    });
  });
});
