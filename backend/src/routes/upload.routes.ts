import { Elysia } from "elysia";
import * as uploadController from "../controllers/upload.controller";

export default new Elysia({ prefix: "/api/upload" })
  .post("/payment-slip", uploadController.uploadPaymentSlip)
  .post("/warehouse-image", uploadController.uploadWarehouseImage);
