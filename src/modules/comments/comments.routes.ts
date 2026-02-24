import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import {
  createCommentHandler,
  getCommentsHandler,
  updateCommentHandler,
  deleteCommentHandler,
} from "./comments.controller";

const router = Router();

router.post("/tickets/:id/comments", authenticate, createCommentHandler);

router.get("/tickets/:id/comments", authenticate, getCommentsHandler);

router.patch("/comments/:id", authenticate, updateCommentHandler);

router.delete("/comments/:id", authenticate, deleteCommentHandler);

export default router;
