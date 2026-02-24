import type { Request, Response } from "express";
import { createUserSchema } from "./users.validation";
import { createUser, getAllUsers } from "./users.service";

export const createUserHandler = async (req: Request, res: Response) => {
  try {
    const validatedData = createUserSchema.parse(req.body);

    const user = await createUser(
      validatedData.name,
      validatedData.email,
      validatedData.password,
      validatedData.role,
    );

    return res.status(201).json(user);
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || "Failed to create user",
    });
  }
};

export const getUsersHandler = async (_: Request, res: Response) => {
  const users = await getAllUsers();
  return res.status(200).json(users);
};
