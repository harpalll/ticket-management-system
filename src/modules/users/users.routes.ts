import { Router } from "express";
import { createUserHandler, getUsersHandler } from "./users.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/rbac.middleware";

const router = Router();

router.post("/", authenticate, authorize("MANAGER"), createUserHandler);

router.get("/", authenticate, authorize("MANAGER"), getUsersHandler);

export default router;
