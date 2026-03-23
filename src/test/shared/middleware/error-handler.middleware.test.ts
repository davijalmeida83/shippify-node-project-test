import { Request, Response, NextFunction } from "express";
import { errorHandlerMiddleware } from "../../../shared/middleware/error-handler.middleware";
import { AppError } from "../../../shared/errors/app-error";
import * as loggerModule from "../../../shared/utils/logger";

jest.mock("../../../shared/utils/logger");

describe("Error Handler Middleware", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;
  let mockStatus: jest.Mock;
  let mockJson: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockStatus = jest.fn().mockReturnValue({
      json: jest.fn(),
    });
    mockJson = jest.fn();

    mockReq = {
      originalUrl: "/api/users",
      method: "POST",
      body: { email: "test@example.com" },
    };

    mockRes = {
      status: mockStatus,
      json: mockJson,
    };

    mockNext = jest.fn();
  });

  it("should log error details and return 500 for generic errors", () => {
    // Arrange
    const error = new Error("Database connection failed");

    // Act
    errorHandlerMiddleware(
      error,
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    // Assert
    expect(loggerModule.logger.error).toHaveBeenCalledWith(
      "Erro capturado pelo errorHandlerMiddleware:",
      expect.objectContaining({
        rota: "/api/users",
        metodo: "POST",
        erro: "Database connection failed",
      })
    );
    expect(mockStatus).toHaveBeenCalledWith(500);
  });

  it("should return AppError status code when error is an AppError instance", () => {
    // Arrange
    const error = new AppError("User not found", 404);

    // Act
    errorHandlerMiddleware(
      error,
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    // Assert
    expect(mockStatus).toHaveBeenCalledWith(404);
  });

  it("should return AppError message in response body", () => {
    // Arrange
    const error = new AppError("Invalid email format", 400);
    const mockJsonFn = jest.fn();
    mockStatus.mockReturnValue({ json: mockJsonFn });

    // Act
    errorHandlerMiddleware(
      error,
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    // Assert
    expect(mockJsonFn).toHaveBeenCalledWith({ message: "Invalid email format" });
  });

  it("should return generic error message for non-AppError errors", () => {
    // Arrange
    const error = new Error("Unexpected error");
    const mockJsonFn = jest.fn();
    mockStatus.mockReturnValue({ json: mockJsonFn });

    // Act
    errorHandlerMiddleware(
      error,
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    // Assert
    expect(mockJsonFn).toHaveBeenCalledWith({
      message: "Erro interno do servidor",
    });
  });

  it("should include error stack trace in logs", () => {
    // Arrange
    const error = new Error("Stack trace test");

    // Act
    errorHandlerMiddleware(
      error,
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    // Assert
    expect(loggerModule.logger.error).toHaveBeenCalledWith(
      "Erro capturado pelo errorHandlerMiddleware:",
      expect.objectContaining({
        stack: expect.any(String),
      })
    );
  });

  it("should handle errors with special characters in message", () => {
    // Arrange
    const error = new AppError("Email já existe: user@test.com", 409);
    const mockJsonFn = jest.fn();
    mockStatus.mockReturnValue({ json: mockJsonFn });

    // Act
    errorHandlerMiddleware(
      error,
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    // Assert
    expect(mockJsonFn).toHaveBeenCalledWith({
      message: "Email já existe: user@test.com",
    });
  });

  it("should preserve request method in error log", () => {
    // Arrange
    const error = new Error("Method test");
    const deleteRequest = { ...mockReq, method: "DELETE" };

    // Act
    errorHandlerMiddleware(
      error,
      deleteRequest as Request,
      mockRes as Response,
      mockNext
    );

    // Assert
    expect(loggerModule.logger.error).toHaveBeenCalledWith(
      "Erro capturado pelo errorHandlerMiddleware:",
      expect.objectContaining({
        metodo: "DELETE",
      })
    );
  });

  it("should not call next() after handling the error", () => {
    // Arrange
    const error = new AppError("Forbidden", 403);

    // Act
    errorHandlerMiddleware(
      error,
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    // Assert
    expect(mockNext).not.toHaveBeenCalled();
  });
});
