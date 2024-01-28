import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const lessonSelect = Prisma.validator<Prisma.LessonDefaultArgs>()({
  select: {
    title: true,
    slug: true,
    number: true,
  },
});

export type LessonOutline = Prisma.LessonGetPayload<typeof lessonSelect> & {
  path: string;
};

const chapterSelect = Prisma.validator<Prisma.ChapterDefaultArgs>()({
  select: {
    title: true,
    slug: true,
    number: true,
    lessons: lessonSelect,
  },
});

// Omit is for tell TS to use proper type because we are adding path in LessonoutLine manually
// and Prisma is not aware of it on its own...
export type ChapterOutline = Omit<
  Prisma.ChapterGetPayload<typeof chapterSelect>,
  'lessons'
> & {
  lessons: LessonOutline[];
};

const courseSelect = Prisma.validator<Prisma.CourseDefaultArgs>()({
  select: {
    title: true,
    chapters: chapterSelect,
  },
});

// same thing as above
export type CourseOutline = Omit<
  Prisma.ChapterGetPayload<typeof courseSelect>,
  'chapters'
> & {
  chapters: ChapterOutline[];
};

export default defineEventHandler(async (): Promise<CourseOutline> => {
  // cant combine include with select,
  // that's why we use only selects here...
  // that's why we create the types above...
  const outline = await prisma.course.findFirst(courseSelect);

  // error if no course
  if (!outline) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Course not found',
    });
  }

  const chapters = outline.chapters.map((chapter) => ({
    ...chapter,
    lessons: chapter.lessons.map((lesson) => ({
      ...lesson,
      path: `/course/chapter/${chapter.slug}/lesson/${lesson.slug}`,
    })),
  }));

  return {
    ...outline,
    chapters,
  };
});
