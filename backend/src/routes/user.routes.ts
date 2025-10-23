import { Elysia } from "elysia";
import * as userController from "../controllers/user.controller";

const userRoutes = new Elysia({ prefix: "/users" })
  .get("/", userController.getAllUsers)
  .get("/:id", userController.getUserById)
  .post("/", userController.createUser);

export default userRoutes;
