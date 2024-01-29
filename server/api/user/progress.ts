import { PrismaClient } from '@prisma/client';
import protectRoute from '~/server/utils/protectRoute';
import { ChapterOutline, LessonOutline } from '../course/meta.get';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  // throw a 401 if there is no user logged in
  protectRoute(event);

  // get user email from the supabasse user if there is on
  const {
    user: { email: userEmail },
  } = event.context;

  // get the progress from the DB
  const userProgress = await prisma.lessonProgress.findMany({
    where: {
      userEmail,
      // we only want to get the progress for the first course right now
      Lesson: {
        Chapter: {
          Course: {
            id: 1,
          },
        },
      },
    },
    select: {
      completed: true,
      Lesson: {
        select: {
          slug: true,
          Chapter: {
            select: {
              slug: true,
            },
          },
        },
      },
    },
  });

  // get course outline for meta endpoint
  const courseOutline = await $fetch('/api/course/meta');

  if (!courseOutline) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Course outline not found',
    });
  }

  // use the course outline and user progress to create an object
  // with the progress for each lesson
  const progress = courseOutline.chapters.reduce(
    (courseProgress: CourseProgress, chapter: ChapterOutline) => {
      // collect the progress for each chapter in the course
      courseProgress[chapter.slug] = chapter.lessons.reduce(
        (chapterProgress: ChapterProgress, lesson: LessonOutline) => {
          chapterProgress[lesson.slug] =
            userProgress.find(
              (progress) =>
                progress.Lesson.slug === lesson.slug &&
                progress.Lesson.Chapter.slug === chapter.slug
            )?.completed || false;

          return chapterProgress;
        },
        {}
      );

      return courseProgress;
    },
    {}
  );

  return progress;
});
