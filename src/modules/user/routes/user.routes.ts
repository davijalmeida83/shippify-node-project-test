import { Router } from "express";
import { container } from "tsyringe";
import { UserController } from "../controllers/user.controller";
import { ensureAuthenticated } from "../../auth/middlewares/ensure-authenticated";
import { validateRequestBodyDto } from "../../../shared/middleware/validation.middleware";
import { RegisterRequestDto } from "../dtos/Request/register-request.dto";

const userRoutes = Router();

userRoutes.post("/register", validateRequestBodyDto(RegisterRequestDto), (req, res, next) => {
  const userController = container.resolve(UserController);
  return userController.register(req, res, next);
});

userRoutes.get("/", ensureAuthenticated, (req, res, next) => {
  const userController = container.resolve(UserController);
  return userController.getAllUsers(req, res, next);
});

userRoutes.get("/:id", ensureAuthenticated, (req, res, next) => {
  const userController = container.resolve(UserController);
  return userController.getUserById(req, res, next);
});

userRoutes.put("/:id", ensureAuthenticated, (req, res, next) => {
  const userController = container.resolve(UserController);
  return userController.updateUser(req, res, next);
});

userRoutes.delete("/:id", ensureAuthenticated, (req, res, next) => {
  const userController = container.resolve(UserController);
  return userController.deleteUser(req, res, next);
});

export { userRoutes };