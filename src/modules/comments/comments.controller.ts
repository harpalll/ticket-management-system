import type { Response } from "express";
import type { AuthRequest } from "../../middleware/auth.middleware";
import {
  createComment,
  getComments,
  updateComment,
  deleteComment,
  canAccessTicket,
} from "./comments.service";
import {
  createCommentSchema,
  updateCommentSchema,
} from "./comments.validation";

export const createCommentHandler = async (req: AuthRequest, res: Response) => {
  try {
    const validated = createCommentSchema.parse(req.body);

    await canAccessTicket(Number(req.params.id), req.user);

    const comment = await createComment(
      Number(req.params.id),
      req.user.userId,
      validated.comment,
    );

    res.status(201).json(comment);
  } catch (err: any) {
    res.status(err.message === "Forbidden" ? 403 : 400).json({
      message: err.message,
    });
  }
};

export const getCommentsHandler = async (req: AuthRequest, res: Response) => {
  try {
    await canAccessTicket(Number(req.params.id), req.user);

    const comments = await getComments(Number(req.params.id));

    res.status(200).json(comments);
  } catch (err: any) {
    res.status(err.message === "Forbidden" ? 403 : 400).json({
      message: err.message,
    });
  }
};

export const updateCommentHandler = async (req: AuthRequest, res: Response) => {
  try {
    const validated = updateCommentSchema.parse(req.body);

    const comment = await updateComment(
      Number(req.params.id),
      req.user,
      validated.comment,
    );

    res.status(200).json(comment);
  } catch (err: any) {
    res.status(err.message === "Forbidden" ? 403 : 400).json({
      message: err.message,
    });
  }
};

export const deleteCommentHandler = async (req: AuthRequest, res: Response) => {
  try {
    await deleteComment(Number(req.params.id), req.user);
    res.status(204).send();
  } catch (err: any) {
    res.status(err.message === "Forbidden" ? 403 : 400).json({
      message: err.message,
    });
  }
};
