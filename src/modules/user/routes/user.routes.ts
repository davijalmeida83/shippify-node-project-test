import { Router } from "express";
import { container } from "tsyringe";
import { UserController } from "../controllers/user.controller";
import { ensureAuthenticated } from "../../auth/middlewares/ensure-authenticated";
import { validateRequestBodyDto } from "../../../shared/middleware/validation.middleware";
import { RegisterRequestDto } from "../dtos/Request/register-request.dto";
import { UpdateUserRequestDto } from "../dtos/Request/update-user-request.dto";

const userRoutes = Router();

userRoutes.post(
  "/register",
  validateRequestBodyDto(RegisterRequestDto),
  async (req, res, next) => {
    const userController = container.resolve(UserController);
    await userController.register(req, res, next);
  }
);

userRoutes.get(
  "/",
  ensureAuthenticated,
  async (req, res, next) => {
    const userController = container.resolve(UserController);
    await userController.getAllUsers(req, res, next);
  }
);

userRoutes.get(
  "/:id",
  ensureAuthenticated,
  async (req, res, next) => {
    const userController = container.resolve(UserController);
    await userController.getUserById(req, res, next);
  }
);

userRoutes.put(
  "/:id",
  ensureAuthenticated,
  validateRequestBodyDto(UpdateUserRequestDto),
  async (req, res, next) => {
    const userController = container.resolve(UserController);
    await userController.updateUser(req, res, next);
  }
);

userRoutes.delete(
  "/:id",
  ensureAuthenticated,
  async (req, res, next) => {
    const userController = container.resolve(UserController);
    await userController.deleteUser(req, res, next);
  }
);

export { userRoutes };