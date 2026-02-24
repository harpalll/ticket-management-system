import express from "express";
import cors from "cors";
import { prisma } from "./config/db";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", async (_, res) => {
  res.json({ message: "Support Ticket API Running 🚀" });
});

app.get("/health", async (_, res) => {
  res.json({ message: "Support Ticket API is up and running 🚀" });
});

import authRoutes from "./modules/auth/auth.routes";
import usersRoutes from "./modules/users/users.routes";
import ticketsRoutes from "./modules/tickets/tickets.routes";

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/tickets", ticketsRoutes);

export default app;
