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
app.use("/auth", authRoutes);

export default app;
