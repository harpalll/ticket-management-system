import { Router } from "express";
import { createUserHandler, getUsersHandler } from "./users.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/rbac.middleware";

const router = Router();

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create new user (MANAGER only)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required: [name, email, password, role]
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 $ref: '#/components/schemas/Role'
 *     responses:
 *       201:
 *         description: User created
 *       403:
 *         description: Forbidden
 */
router.post("/", authenticate, authorize("MANAGER"), createUserHandler);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (MANAGER only)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *       403:
 *         description: Forbidden
 */
router.get("/", authenticate, authorize("MANAGER"), getUsersHandler);

export default router;
