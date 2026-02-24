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
 *     summary: Get tickets with pagination and filtering
 *     description: |
 *       Returns tickets based on user role.
 *       - MANAGER → Can view all tickets
 *       - SUPPORT → Can view only assigned tickets
 *       - USER → Can view only their created tickets
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number (default is 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of tickets per page (max 50)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [OPEN, IN_PROGRESS, CLOSED]
 *           example: CLOSED
 *         description: Filter tickets by status
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH]
 *           example: HIGH
 *         description: Filter tickets by priority
 *     responses:
 *       200:
 *         description: Paginated ticket list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 total:
 *                   type: integer
 *                   example: 25
 *                 totalPages:
 *                   type: integer
 *                   example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized (Missing or invalid token)
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
