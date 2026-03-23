import { Router } from "express";
import { container } from "tsyringe";
import { AuthController } from "../controllers/auth.controller";
import { validateRequestBodyDto } from "../../../shared/middleware/validation.middleware";
import { LoginRequestDto } from "../dtos/Request/login-request.dto";

const authRoutes = Router();

authRoutes.post(
  "/login",
  validateRequestBodyDto(LoginRequestDto),
  async (req, res, next) => {
    const authController = container.resolve(AuthController);
    await authController.login(req, res, next);
  }
);

export { authRoutes };
    