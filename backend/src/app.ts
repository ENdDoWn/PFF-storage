import { Elysia } from "elysia";
import userRoutes from "./routes/user.routes";

const app = new Elysia()
  .get("/", () => "Welcome to PFF-Storage API")
  .get("/health", () => ({ status: "healthy", timestamp: new Date().toISOString() }))
  .use(userRoutes)
  .listen(3001);

console.log("🚀 Elysia running at http://localhost:3001");
