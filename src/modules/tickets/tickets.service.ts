import { prisma } from "../../config/db";
import { TicketStatus, RoleName } from "../../generated/prisma/client";

const allowedTransitions: Record<TicketStatus, TicketStatus | null> = {
  OPEN: TicketStatus.IN_PROGRESS,
  IN_PROGRESS: TicketStatus.RESOLVED,
  RESOLVED: TicketStatus.CLOSED,
  CLOSED: null,
};

export const createTicket = async (
  title: string,
  description: string,
  priority: any,
  userId: number,
) => {
  return prisma.ticket.create({
    data: {
      title,
      description,
      priority,
      createdBy: userId,
    },
  });
};

export const getTickets = async (user: any) => {
  if (user.role === RoleName.MANAGER) {
    return prisma.ticket.findMany({
      include: { creator: true, assignee: true },
    });
  }

  if (user.role === RoleName.SUPPORT) {
    return prisma.ticket.findMany({
      where: { assignedTo: user.userId },
    });
  }

  return prisma.ticket.findMany({
    where: { createdBy: user.userId },
  });
};

export const assignTicket = async (
  ticketId: number,
  assignToUserId: number,
) => {
  const user = await prisma.user.findUnique({
    where: { id: assignToUserId },
    include: { role: true },
  });

  if (!user) throw new Error("User not found");

  if (user.role.name === RoleName.USER) {
    throw new Error("Cannot assign ticket to USER role");
  }

  return prisma.ticket.update({
    where: { id: ticketId },
    data: { assignedTo: assignToUserId },
  });
};

export const updateTicketStatus = async (
  ticketId: number,
  newStatus: TicketStatus,
  changedBy: number,
) => {
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
  });

  if (!ticket) throw new Error("Ticket not found");

  const allowedNext = allowedTransitions[ticket.status];

  if (allowedNext !== newStatus) {
    throw new Error("Invalid status transition");
  }

  await prisma.ticketStatusLog.create({
    data: {
      ticketId,
      oldStatus: ticket.status,
      newStatus: newStatus,
      changedBy,
    },
  });

  return prisma.ticket.update({
    where: { id: ticketId },
    data: { status: newStatus },
  });
};

export const deleteTicket = async (ticketId: number) => {
  return prisma.ticket.delete({
    where: { id: ticketId },
  });
};
