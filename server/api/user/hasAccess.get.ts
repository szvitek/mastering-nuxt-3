import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

interface User {
  email: string;
}

export default defineEventHandler(async (event) => {
  const user = event.context.user as User;

  // No user is logged in
  if (!user) {
    return false;
  }

  const coursePurchases = await prisma.coursePurchase.findMany({
    where: {
      userEmail: user.email,
      verified: true,
      // !!hardcoded course ID
      couseId: 1,
    },
  });

  return coursePurchases.length > 0;
});
