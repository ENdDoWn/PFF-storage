import { Elysia } from "elysia";
import * as adminController from "../controllers/admin.controller";

export default new Elysia({ prefix: "/api/admin" })
  .get("/stats", adminController.getDashboardStats)
  .get("/users", adminController.getAllUsers)
  .get("/users/cognito", adminController.getAllCognitoUsers)
  .get("/warehouses", adminController.getAllWarehouses)
  .get("/rentals/pending", adminController.getPendingRentals)
  .post("/rentals/:userId/:rentalId/approve", adminController.approveRental)
  .post("/rentals/:userId/:rentalId/reject", adminController.rejectRental);
