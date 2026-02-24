import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/rbac.middleware";
import {
  createTicketHandler,
  getTicketsHandler,
  assignTicketHandler,
  updateStatusHandler,
  deleteTicketHandler,
} from "./tickets.controller";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("USER", "MANAGER"),
  createTicketHandler,
);
router.get("/", authenticate, getTicketsHandler);

router.patch(
  "/:id/assign",
  authenticate,
  authorize("MANAGER", "SUPPORT"),
  assignTicketHandler,
);

router.patch(
  "/:id/status",
  authenticate,
  authorize("MANAGER", "SUPPORT"),
  updateStatusHandler,
);

router.delete("/:id", authenticate, authorize("MANAGER"), deleteTicketHandler);

export default router;
