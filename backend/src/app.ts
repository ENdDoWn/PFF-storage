import { Elysia } from "elysia";
import userRoutes from "./routes/user.routes";

const app = new Elysia()
  .use(userRoutes)
  .listen(3000);

console.log("🚀 Elysia running at http://localhost:3000");
