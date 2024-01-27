import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const chapterSlug = getRouterParam(event, 'chapterSlug');
  const lessonSlug = getRouterParam(event, 'lessonSlug');

  return prisma.lesson.findFirst({
    where: {
      Chapter: {
        slug: chapterSlug,
      },
    },
    include: {
      Chapter: {
        select: {
          slug: true,
          title: true,
        },
      },
    },
  });
});
