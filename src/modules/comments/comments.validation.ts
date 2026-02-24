import { z } from "zod";

export const createCommentSchema = z.object({
  comment: z.string().min(1),
});

export const updateCommentSchema = z.object({
  comment: z.string().min(1),
});
