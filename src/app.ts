import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", async (_, res) => {
  res.json({ message: "Support Ticket API Running 🚀" });
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/health", async (_, res) => {
  res.json({ message: "Support Ticket API is up and running 🚀" });
});

import authRoutes from "./modules/auth/auth.routes";
import commentsRoutes from "./modules/comments/comments.routes";
import ticketsRoutes from "./modules/tickets/tickets.routes";
import usersRoutes from "./modules/users/users.routes";

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/tickets", ticketsRoutes);
app.use("/", commentsRoutes);

export default app;
