import { prisma } from "../../config/db";
import {
  TicketStatus,
  RoleName,
  TicketPriority,
} from "../../generated/prisma/client";

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

// export const getTickets = async (user: any) => {
//   if (user.role === RoleName.MANAGER) {
//     return prisma.ticket.findMany({
//       include: { creator: true, assignee: true },
//     });
//   }

//   if (user.role === RoleName.SUPPORT) {
//     return prisma.ticket.findMany({
//       where: { assignedTo: user.userId },
//     });
//   }

//   return prisma.ticket.findMany({
//     where: { createdBy: user.userId },
//   });
// };
export const getTickets = async (
  user: any,
  query: {
    page?: string;
    limit?: string;
    status?: string;
    priority?: string;
  },
) => {
  const page = Number(query.page) || 1;
  const limit = Math.min(Number(query.limit) || 10, 50);
  const skip = (page - 1) * limit;
  console.log("USER:", user);

  const where: any = {};

  if (user.role === RoleName.SUPPORT) {
    where.assignedTo = user.userId;
  } else if (user.role === RoleName.USER) {
    where.createdBy = user.userId;
  }

  if (query.status) {
    const normalizedStatus = query.status.toUpperCase();

    if (
      !Object.values(TicketStatus).includes(normalizedStatus as TicketStatus)
    ) {
      throw new Error("Invalid status value");
    }

    where.status = normalizedStatus as TicketStatus;
  }

  if (query.priority) {
    const normalizedPriority = query.priority.toUpperCase();

    if (
      !Object.values(TicketPriority).includes(
        normalizedPriority as TicketPriority,
      )
    ) {
      throw new Error("Invalid priority value");
    }

    where.priority = normalizedPriority as TicketPriority;
  }

  console.log(where);
  console.log("WHERE:", where);

  const [tickets, total] = await Promise.all([
    prisma.ticket.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            roleId: true,
          },
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            roleId: true,
          },
        },
      },
    }),
    prisma.ticket.count({ where }),
  ]);

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    data: tickets,
  };
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
