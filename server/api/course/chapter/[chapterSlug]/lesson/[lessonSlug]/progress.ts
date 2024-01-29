import { PrismaClient } from '@prisma/client';
import protectRoute from '~/server/utils/protectRoute';

const prisma = new PrismaClient();

// Endpoint that updated the progress of a lesson
export default defineEventHandler(async (event) => {
  // only allow PUT, PATCH, or POST requests
  assertMethod(event, ['PUT', 'PATCH', 'POST']);

  // throw a 401 if there is no user logged in
  protectRoute(event);

  // get the route params
  const chapterSlug = getRouterParam(event, 'chapterSlug');
  const lessonSlug = getRouterParam(event, 'lessonSlug');

  // get the lesson from the DB
  const lesson = await prisma.lesson.findFirst({
    where: {
      slug: lessonSlug,
      Chapter: {
        slug: chapterSlug,
      },
    },
  });

  // if the lesson doesn't exist, throw a 404
  if (!lesson) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Lesson not found',
    });
  }

  // get the completed value from the request body and update progress
  // select based on the chapter and lesson slugs
  const { completed } = await readBody(event)
  // get user email from the supabasse user if there is on
  const {
    user: { email: userEmail }
  } = event.context;

  return prisma.lessonProgress.upsert({
    where: {
      lessonId_userEmail: {
        lessonId: lesson.id,
        userEmail
      }
    },
    update: {
      completed
    },
    create: {
      completed,
      userEmail,
      Lesson: {
        connect: {
          id: lesson.id
        }
      }
    }
  })
});
