import { Router } from "express";
import { container } from "tsyringe";
import { UserController } from "../controllers/user.controller";
import { ensureAuthenticated } from "../../auth/middlewares/ensure-authenticated";

const userRoutes = Router();
const userController = container.resolve(UserController);

userRoutes.post("/register", (req, res, next) =>
  userController.register(req, res, next)
);

userRoutes.get("/", ensureAuthenticated, (req, res, next) =>
  userController.getAllUsers(req, res, next)
);

userRoutes.get("/:id", ensureAuthenticated, (req, res, next) =>
  userController.getUserById(req, res, next)
);

userRoutes.put("/:id", ensureAuthenticated, (req, res, next) =>
  userController.updateUser(req, res, next)
);

userRoutes.delete("/:id", ensureAuthenticated, (req, res, next) =>
  userController.deleteUser(req, res, next)
);

export { userRoutes };