type Lesson = {
  title: string;
  slug: string;
  number: number;
  downloadUrl: string;
  sourceUrl?: string;
  videoId: number;
  text: string;
};

type LessonWithPath = Lesson & {
  path: string;
};

type Chapter = {
  title: string;
  slug: string;
  number: number;
  lessons: Lesson[] | LessonWithPath[];
};

type Course = {
  title: string;
  chapters: Chapter[];
};

type Maybe<T> = T | null | undefined;

type OutlineBase = {
  title: string;
  slug: string;
  number: number;
};

type OutlineChapter = OutlineBase & {
  lessons: OutlineLesson[];
};

type OutlineLesson = OutlineBase & {
  path: string;
};

type CourseMeta = {
  title: string;
  chapters: OutlineChapter[];
};