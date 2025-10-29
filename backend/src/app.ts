import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import userRoutes from "./routes/user.routes";
import warehouseRoutes from "./routes/warehouse.routes";
import rentalRoutes from "./routes/booking.routes";
import adminRoutes from "./routes/admin.routes";
import uploadRoutes from "./routes/upload.routes";

const app = new Elysia()
  .use(cors({
    origin: 'https://www.pff-storage.enddown.online',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }))
  .use(cors())
  .get("/", () => {
    return new Response(
      JSON.stringify({ message: 'Welcome to PFF-Storage API' }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200
      }
    )})
  .get("/health", () => new Response('healthy', { status: 200 }))
  .use(userRoutes)
  .use(warehouseRoutes)
  .use(rentalRoutes)
  .use(adminRoutes)
  .use(uploadRoutes);

export { app };
