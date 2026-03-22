import { Router } from "express";
import { container } from "tsyringe";
import { AuthController } from "../controllers/auth.controller";

const authRoutes = Router();

authRoutes.post("/login", (req, res, next) => {
  const authController = container.resolve(AuthController);
  return authController.login(req, res, next);
});

export { authRoutes };
