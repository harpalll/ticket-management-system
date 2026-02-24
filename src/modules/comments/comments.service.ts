import { prisma } from "../../config/db";
import { RoleName } from "../../generated/prisma/client";

export const canAccessTicket = async (ticketId: number, user: any) => {
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
  });

  if (!ticket) throw new Error("Ticket not found");

  if (user.role === RoleName.MANAGER) return true;

  if (user.role === RoleName.USER && ticket.createdBy === user.userId)
    return true;

  if (user.role === RoleName.SUPPORT && ticket.assignedTo === user.userId)
    return true;

  throw new Error("Forbidden");
};

export const createComment = async (
  ticketId: number,
  userId: number,
  comment: string,
) => {
  return prisma.ticketComment.create({
    data: {
      ticketId,
      userId,
      comment,
    },
  });
};

export const getComments = async (ticketId: number) => {
  return prisma.ticketComment.findMany({
    where: { ticketId },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });
};

export const updateComment = async (
  commentId: number,
  user: any,
  newComment: string,
) => {
  const comment = await prisma.ticketComment.findUnique({
    where: { id: commentId },
  });

  if (!comment) throw new Error("Comment not found");

  if (user.role !== RoleName.MANAGER && comment.userId !== user.userId) {
    throw new Error("Forbidden");
  }

  return prisma.ticketComment.update({
    where: { id: commentId },
    data: { comment: newComment },
  });
};

export const deleteComment = async (commentId: number, user: any) => {
  const comment = await prisma.ticketComment.findUnique({
    where: { id: commentId },
  });

  if (!comment) throw new Error("Comment not found");

  if (user.role !== RoleName.MANAGER && comment.userId !== user.userId) {
    throw new Error("Forbidden");
  }

  return prisma.ticketComment.delete({
    where: { id: commentId },
  });
};
