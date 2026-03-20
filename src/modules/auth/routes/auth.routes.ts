import { Router } from "express";
import { container } from "tsyringe";
import { AuthController } from "../controllers/auth.controller";

const authRoutes = Router();
const authController = container.resolve(AuthController);

authRoutes.post("/login", (req, res, next) =>
  authController.login(req, res, next)
);

export { authRoutes };
