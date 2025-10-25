import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import userRoutes from "./routes/user.routes";
import warehouseRoutes from "./routes/warehouse.routes";
import rentalRoutes from "./routes/booking.routes";
import adminRoutes from "./routes/admin.routes";
import uploadRoutes from "./routes/upload.routes";

const app = new Elysia()
  .use(cors())
  .get("/", () => "Welcome to PFF-Storage API")
  .get("/health", () => ({ status: "healthy", timestamp: new Date().toISOString() }))
  .use(userRoutes)
  .use(warehouseRoutes)
  .use(rentalRoutes)
  .use(adminRoutes)
  .use(uploadRoutes)
  .listen(3005);

console.log("🚀 Elysia running at http://localhost:3005");
