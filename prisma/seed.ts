import bcrypt from "bcryptjs";
import { prisma } from "../src/config/db";
import { PrismaClient, RoleName } from "../src/generated/prisma/client";

async function main() {
  await prisma.role.createMany({
    data: [
      { name: RoleName.MANAGER },
      { name: RoleName.SUPPORT },
      { name: RoleName.USER },
    ],
    skipDuplicates: true,
  });

  console.log("Roles seeded 🌱");

  const managerRole = await prisma.role.findUnique({
    where: { name: RoleName.MANAGER },
  });

  if (!managerRole) throw new Error("MANAGER role not found");

  // 3️⃣ Hash password
  const hashedPassword = await bcrypt.hash("Manager@123", 10);

  // 4️⃣ Create MANAGER user
  await prisma.user.upsert({
    where: { email: "manager@company.com" },
    update: {},
    create: {
      name: "System Manager",
      email: "manager@company.com",
      password: hashedPassword,
      roleId: managerRole.id,
    },
  });

  console.log("Default MANAGER created 👑");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
