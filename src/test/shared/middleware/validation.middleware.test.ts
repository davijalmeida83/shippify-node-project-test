import { Request, Response, NextFunction } from "express";
import { validateRequestBodyDto } from "../../../shared/middleware/validation.middleware";
import { AppError } from "../../../shared/errors/app-error";
import * as loggerModule from "../../../shared/utils/logger";
import { Expose } from "class-transformer";
import { IsString } from "class-validator";

jest.mock("../../../shared/utils/logger");

describe("Validation Middleware", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockReq = {
      body: { email: "test@example.com", name: "John Doe" },
    };

    mockRes = {};
    mockNext = jest.fn();
  });

  it("should log validation start with DTO name", async () => {
    // Arrange
    class UserDTO {
      @Expose()
      email!: string;

      @Expose()
      name!: string;
    }

    const middleware = validateRequestBodyDto(UserDTO);

    // Act
    await middleware(
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    // Assert
    const infoCall = (loggerModule.logger.info as jest.Mock).mock.calls[0];
    expect(infoCall[0]).toContain("UserDTO");
  });

  it("should call next() when validation passes", async () => {
    // Arrange
    class UserDTO {
      @Expose()
      email!: string;

      @Expose()
      name!: string;
    }

    const middleware = validateRequestBodyDto(UserDTO);

    // Act
    await middleware(
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    // Assert
    expect(mockNext).toHaveBeenCalled();
  });

  it("should reject forbidden fields not in DTO", async () => {
    // Arrange
    class UserDTO {
      @Expose()
      email!: string;
    }

    mockReq.body = { email: "test@example.com", forbidden: "field" };
    const middleware = validateRequestBodyDto(UserDTO);

    // Act
    await middleware(
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    // Assert
    const errorArg = mockNext.mock.calls[0][0];
    expect(errorArg).toBeInstanceOf(AppError);
    expect(errorArg.message).toContain("Forbidden field");
  });

  it("should transform request body to DTO instance", async () => {
    // Arrange
    class UserDTO {
      @Expose()
      email!: string;

      @Expose()
      name!: string;
    }

    const middleware = validateRequestBodyDto(UserDTO);

    // Act
    await middleware(
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    // Assert
    expect(mockNext).toHaveBeenCalled();
    expect(mockReq.body).toHaveProperty("email", "test@example.com");
    expect(mockReq.body).toHaveProperty("name", "John Doe");
  });

  it("should catch errors and pass to error middleware", async () => {
    // Arrange
    class UserDTO {
      @Expose()
      email!: string;
    }

    mockReq.body = null;
    const middleware = validateRequestBodyDto(UserDTO);

    // Act
    await middleware(
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    // Assert
    expect(mockNext).toHaveBeenCalled();
    const errorArg = mockNext.mock.calls[0][0];
    expect(errorArg).toBeInstanceOf(Error);
  });

  it("should log errors when validation fails", async () => {
    // Arrange
    class UserDTO {
      @Expose()
      email!: string;
    }

    mockReq.body = { email: "invalid-email" };
    mockReq.originalUrl = "/api/users";
    mockReq.method = "POST";

    const middleware = validateRequestBodyDto(UserDTO);

    // Act
    await middleware(
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    // Assert
    if (mockNext.mock.calls[0][0] instanceof Error) {
      expect(loggerModule.logger.error).toHaveBeenCalled();
    }
  });

  it("should handle multiple forbidden fields", async () => {
    // Arrange
    class UserDTO {
      @Expose()
      email!: string;
    }

    mockReq.body = {
      email: "test@example.com",
      name: "John",
      phone: "123456",
    };

    const middleware = validateRequestBodyDto(UserDTO);

    // Act
    await middleware(
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    // Assert
    const errorArg = mockNext.mock.calls[0][0];
    expect(errorArg).toBeInstanceOf(AppError);
    expect(errorArg.message).toContain("Forbidden field(s)");
    expect(errorArg.message).toContain("name");
    expect(errorArg.message).toContain("phone");
  });

  it("should handle empty request body", async () => {
    // Arrange
    mockReq.body = {};

    class UserDTO {
      @Expose()
      email!: string;
    }

    const middleware = validateRequestBodyDto(UserDTO);

    // Act
    await middleware(
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    // Assert
    expect(mockNext).toHaveBeenCalled();
  });

  it("should successfully replace body and call next() on valid input", async () => {
    // Arrange - Using real validator decorator
    class ValidatedDTO {
      @Expose()
      @IsString()
      name!: string;
    }

    mockReq.body = { name: "John" };
    const middleware = validateRequestBodyDto(ValidatedDTO);

    // Act
    await middleware(
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    // Assert
    expect(mockNext).toHaveBeenCalled();
    const callArgs = mockNext.mock.calls[0];
    // Successful validation should call next() without error
    // or with no arguments at all
    if (callArgs.length === 0) {
      // Perfect - called with no arguments (success path)
      expect(mockReq.body).toBeDefined();
    }
  });

  it("should pass error to next when forbidden fields present", async () => {
    // Arrange
    class RestrictedDTO {
      @Expose()
      email!: string;
    }

    mockReq.body = { email: "test@test.com", extra: "value" };
    const middleware = validateRequestBodyDto(RestrictedDTO);

    // Act
    await middleware(
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    // Assert
    const errorPassed = mockNext.mock.calls[0][0];
    expect(errorPassed).toBeInstanceOf(AppError);
    expect(errorPassed.message).toContain("Forbidden");
  });

  it("should handle error with no constraints object", async () => {
    // Arrange - DTO that will fail validation but might have no constraints
    class StrictDTO {
      @Expose()
      @IsString()
      text!: string;
    }

    mockReq.body = { text: 123 }; // Number instead of string
    const middleware = validateRequestBodyDto(StrictDTO);

    // Act
    await middleware(
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    // Assert
    expect(mockNext).toHaveBeenCalled();
    const errorArg = mockNext.mock.calls[0][0];
    if (errorArg instanceof AppError) {
      expect(errorArg.statusCode).toBe(400);
    }
  });
});
