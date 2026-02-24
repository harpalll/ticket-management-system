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

/**
 * @swagger
 * /tickets:
 *   post:
 *     summary: Create ticket
 *     tags: [Tickets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required: [title, description, priority]
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 5
 *               description:
 *                 type: string
 *                 minLength: 10
 *               priority:
 *                 $ref: '#/components/schemas/TicketPriority'
 *     responses:
 *       201:
 *         description: Ticket created
 *       400:
 *         description: Validation error
 */
router.post(
  "/",
  authenticate,
  authorize("USER", "MANAGER"),
  createTicketHandler,
);

/**
 * @swagger
 * /tickets:
 *   get:
 *     summary: Get tickets based on role
 *     tags: [Tickets]
 *     responses:
 *       200:
 *         description: Ticket list
 *       403:
 *         description: Forbidden
 */
router.get("/", authenticate, getTicketsHandler);

/**
 * @swagger
 * /tickets/{id}/assign:
 *   patch:
 *     summary: Assign ticket
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assigned_to:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Ticket assigned
 *       400:
 *         description: Invalid assignment
 */
router.patch(
  "/:id/assign",
  authenticate,
  authorize("MANAGER", "SUPPORT"),
  assignTicketHandler,
);

/**
 * @swagger
 * /tickets/{id}/status:
 *   patch:
 *     summary: Update ticket status
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 $ref: '#/components/schemas/TicketStatus'
 *     responses:
 *       200:
 *         description: Status updated
 *       400:
 *         description: Invalid status transition
 */
router.patch(
  "/:id/status",
  authenticate,
  authorize("MANAGER", "SUPPORT"),
  updateStatusHandler,
);

/**
 * @swagger
 * /tickets/{id}:
 *   delete:
 *     summary: Delete ticket (MANAGER only)
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Ticket deleted
 *       403:
 *         description: Forbidden
 */
router.delete("/:id", authenticate, authorize("MANAGER"), deleteTicketHandler);

export default router;
