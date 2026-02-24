import type { Response } from "express";
import type { AuthRequest } from "../../middleware/auth.middleware";
import {
  createTicket,
  getTickets,
  assignTicket,
  updateTicketStatus,
  deleteTicket,
} from "./tickets.service";
import {
  createTicketSchema,
  assignTicketSchema,
  updateStatusSchema,
} from "./tickets.validation";

export const createTicketHandler = async (req: AuthRequest, res: Response) => {
  try {
    const validated = createTicketSchema.parse(req.body);

    const ticket = await createTicket(
      validated.title,
      validated.description,
      validated.priority,
      req.user.userId,
    );

    res.status(201).json(ticket);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getTicketsHandler = async (req: AuthRequest, res: Response) => {
  const tickets = await getTickets(req.user);
  res.status(200).json(tickets);
};

export const assignTicketHandler = async (req: AuthRequest, res: Response) => {
  try {
    const validated = assignTicketSchema.parse(req.body);

    const ticket = await assignTicket(Number(req.params.id), validated.userId);

    res.status(200).json(ticket);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const updateStatusHandler = async (req: AuthRequest, res: Response) => {
  try {
    const validated = updateStatusSchema.parse(req.body);

    const ticket = await updateTicketStatus(
      Number(req.params.id),
      validated.status,
      req.user.userId,
    );

    res.status(200).json(ticket);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteTicketHandler = async (req: AuthRequest, res: Response) => {
  await deleteTicket(Number(req.params.id));
  res.status(204).send();
};
