import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import {
  createCommentHandler,
  getCommentsHandler,
  updateCommentHandler,
  deleteCommentHandler,
} from "./comments.controller";

const router = Router();

/**
 * @swagger
 * /tickets/{id}/comments:
 *   post:
 *     summary: Add comment to ticket
 *     tags: [Comments]
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
 *             required: [comment]
 *             properties:
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment created
 */
router.post("/tickets/:id/comments", authenticate, createCommentHandler);

/**
 * @swagger
 * /tickets/{id}/comments:
 *   get:
 *     summary: Get ticket comments
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of comments
 */
router.get("/tickets/:id/comments", authenticate, getCommentsHandler);

/**
 * @swagger
 * /comments/{id}:
 *   patch:
 *     summary: Update comment
 *     tags: [Comments]
 */
router.patch("/comments/:id", authenticate, updateCommentHandler);

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete comment
 *     tags: [Comments]
 */
router.delete("/comments/:id", authenticate, deleteCommentHandler);

export default router;
