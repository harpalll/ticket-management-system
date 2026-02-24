import { z } from "zod";
import { RoleName } from "../../generated/prisma/client";

export const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.nativeEnum(RoleName),
});
