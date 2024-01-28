type Lesson = import('@prisma/client').Lesson;

type Maybe<T> = T | null | undefined;

type LessonWithPath = Lesson & {
  path: string;
};
