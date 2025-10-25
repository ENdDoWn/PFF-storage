import { Elysia } from "elysia";
import * as warehouseController from "../controllers/warehouse.controller";

const warehouseRoutes = new Elysia({ prefix: "/warehouses" })
  .get("/", warehouseController.getAllWarehouses)
  .get("/stats", warehouseController.getWarehouseStats)
  .get("/:id", warehouseController.getWarehouseById)
  .get("/:id/rooms", warehouseController.getWarehouseRooms)
  .post("/", warehouseController.createWarehouse)
  .post("/:id/rooms", warehouseController.createRoom)
  .put("/:id", warehouseController.updateWarehouse)
  .delete("/:id", warehouseController.deleteWarehouse);

export default warehouseRoutes;
