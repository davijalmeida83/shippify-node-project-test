import { Router } from "express";
import { container } from "tsyringe";
import { UserController } from "../controllers/user.controller";

const userRoutes = Router();
const userController = container.resolve(UserController);

userRoutes.post("/register", (req, res, next) =>
  userController.register(req, res, next)
);

export { userRoutes };