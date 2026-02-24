import { z } from "zod";
import { TicketPriority, TicketStatus } from "../../generated/prisma/client";

export const createTicketSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(10),
  priority: z.nativeEnum(TicketPriority).optional(),
});

export const assignTicketSchema = z.object({
  userId: z.number(),
});

export const updateStatusSchema = z.object({
  status: z.nativeEnum(TicketStatus),
});
