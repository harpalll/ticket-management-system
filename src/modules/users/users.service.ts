import bcrypt from "bcrypt";
import { RoleName } from "../../generated/prisma/client";
import { prisma } from "../../config/db";

export const createUser = async (
  name: string,
  email: string,
  password: string,
  role: RoleName,
) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const roleRecord = await prisma.role.findUnique({
    where: { name: role },
  });

  if (!roleRecord) {
    throw new Error("Invalid role");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      roleId: roleRecord.id,
    },
    include: {
      role: true,
    },
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role.name,
  };
};

export const getAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      role: {
        select: {
          name: true,
        },
      },
    },
  });
};
