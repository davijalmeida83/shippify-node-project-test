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

  describe("Basic logging methods (info, warn, error)", () => {
    it("should log messages with correct prefixes", () => {
      logger.info("App started");
      logger.warn("Warning message");
      logger.error("Error occurred");

      expect(consoleInfoSpy).toHaveBeenCalledWith("[INFO]: App started");
      expect(consoleWarnSpy).toHaveBeenCalledWith("[WARN]: Warning message");
      expect(consoleErrorSpy).toHaveBeenCalledWith("[ERROR]: Error occurred");
    });

    it("should handle additional parameters for all methods", () => {
      const param1 = { userId: 123 };
      const param2 = "context";

      logger.info("User action", param1, param2);
      logger.warn("Deprecation", param1);
      logger.error("Failed request", param1, param2);

      expect(consoleInfoSpy).toHaveBeenCalledWith("[INFO]: User action", param1, param2);
      expect(consoleWarnSpy).toHaveBeenCalledWith("[WARN]: Deprecation", param1);
      expect(consoleErrorSpy).toHaveBeenCalledWith("[ERROR]: Failed request", param1, param2);
    });

    it("should handle null and undefined parameters", () => {
      logger.info("Message", null);
      logger.warn("Message", undefined);
      logger.error("Message", null, undefined);

      expect(consoleInfoSpy).toHaveBeenCalledWith("[INFO]: Message", null);
      expect(consoleWarnSpy).toHaveBeenCalledWith("[WARN]: Message", undefined);
      expect(consoleErrorSpy).toHaveBeenCalledWith("[ERROR]: Message", null, undefined);
    });
  });

  describe("Debug method with DEBUG environment variable", () => {
    it("should log debug message when DEBUG=true", () => {
      process.env.DEBUG = "true";
      logger.debug("Debug message");
      expect(consoleDebugSpy).toHaveBeenCalledWith("[DEBUG]: Debug message");
    });

    it("should not log debug message when DEBUG is not true", () => {
      logger.debug("Debug message");
      expect(consoleDebugSpy).not.toHaveBeenCalled();

      process.env.DEBUG = "false";
      logger.debug("Debug message 2");
      expect(consoleDebugSpy).not.toHaveBeenCalled();
    });

    it("should respect DEBUG variable dynamically", () => {
      logger.debug("Msg 1");
      expect(consoleDebugSpy).not.toHaveBeenCalled();

      process.env.DEBUG = "true";
      consoleDebugSpy.mockClear();
      logger.debug("Msg 2");
      expect(consoleDebugSpy).toHaveBeenCalledWith("[DEBUG]: Msg 2");

      delete process.env.DEBUG;
      consoleDebugSpy.mockClear();
      logger.debug("Msg 3");
      expect(consoleDebugSpy).not.toHaveBeenCalled();
    });

    it("should handle parameters when DEBUG=true", () => {
      process.env.DEBUG = "true";
      const param1 = { level: 5 };
      const param2 = "context";

      logger.debug("Debug info", param1, param2);
      expect(consoleDebugSpy).toHaveBeenCalledWith("[DEBUG]: Debug info", param1, param2);
    });
  });

  describe("Logger consistency across methods", () => {
    it("should use consistent [PREFIX]: format", () => {
      process.env.DEBUG = "true";
      logger.info("Info");
      logger.warn("Warn");
      logger.error("Error");
      logger.debug("Debug");

      expect(consoleInfoSpy).toHaveBeenCalledWith("[INFO]: Info");
      expect(consoleWarnSpy).toHaveBeenCalledWith("[WARN]: Warn");
      expect(consoleErrorSpy).toHaveBeenCalledWith("[ERROR]: Error");
      expect(consoleDebugSpy).toHaveBeenCalledWith("[DEBUG]: Debug");
    });

    it("should preserve parameter order across methods", () => {
      process.env.DEBUG = "true";
      const p1 = "first";
      const p2 = { second: true };

      logger.info("Msg", p1, p2);
      logger.warn("Msg", p1, p2);
      logger.error("Msg", p1, p2);
      logger.debug("Msg", p1, p2);

      [consoleInfoSpy, consoleWarnSpy, consoleErrorSpy, consoleDebugSpy].forEach(
        (spy, idx) => {
          const prefix = ["INFO", "WARN", "ERROR", "DEBUG"][idx];
          expect(spy).toHaveBeenCalledWith(`[${prefix}]: Msg`, p1, p2);
        }
      );
    });
  });

  describe("Edge cases", () => {
    it("should handle very long, empty, and special character messages", () => {
      const longMsg = "A".repeat(1000);
      const emptyMsg = "";
      const specialMsg = "!@#$%^&*()";

      logger.info(longMsg);
      logger.warn(emptyMsg);
      logger.error(specialMsg);

      expect(consoleInfoSpy).toHaveBeenCalledWith(`[INFO]: ${longMsg}`);
      expect(consoleWarnSpy).toHaveBeenCalledWith(`[WARN]: ${emptyMsg}`);
      expect(consoleErrorSpy).toHaveBeenCalledWith(`[ERROR]: ${specialMsg}`);
    });

    it("should handle messages with newlines and special objects", () => {
      logger.info("Line 1\nLine 2");

      const circularObj: any = { name: "test" };
      circularObj.self = circularObj;
      logger.warn("Circular ref", circularObj);

      expect(consoleInfoSpy).toHaveBeenCalledWith("[INFO]: Line 1\nLine 2");
      expect(consoleWarnSpy).toHaveBeenCalledWith("[WARN]: Circular ref", circularObj);
    });

    it("should handle all data types as parameters", () => {
      process.env.DEBUG = "true";
      const dataTypes = [
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

      logger.debug("Types", ...dataTypes);
      expect(consoleDebugSpy).toHaveBeenCalledWith("[DEBUG]: Types", ...dataTypes);
    });
  });
});
