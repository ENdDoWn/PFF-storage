import { Elysia } from "elysia";
import * as rentalController from "../controllers/booking.controller";

const rentalRoutes = new Elysia({ prefix: "/api" })
  // Rental routes
  .post("/rentals", rentalController.createRental)
  .get("/rentals", rentalController.getAllRentals)
  .get("/users/:userId/rentals", rentalController.getUserRentals)
  .get("/users/:userId/rentals/active", rentalController.getActiveRentals)
  .patch("/users/:userId/rentals/:rentalId/status", rentalController.updateRentalStatus)
  
  // Product routes
  .post("/products", rentalController.createProduct)
  .get("/users/:userId/products", rentalController.getUserProducts)
  .patch("/users/:userId/products/:productId", rentalController.updateProduct)
  .delete("/users/:userId/products/:productId", rentalController.deleteProduct);

export default rentalRoutes;
