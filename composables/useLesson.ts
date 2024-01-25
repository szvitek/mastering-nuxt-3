import { StorageSerializers } from "@vueuse/core";

export default async (chapterSlug: string, lessonSlug: string) => {
  // use sessionStorage to cache the lesson data
  const url = `/api/course/chapter/${chapterSlug}/lesson/${lessonSlug}`;
  const lesson = useSessionStorage<LessonWithPath>(
    url,
    null,
    {
      // by passing null as default it can't automatically 
      // determinde which seializer to use
      serializer: StorageSerializers.object
    }
  );
  
  if (!lesson.value) {
    // useFetch is just a wrapper around await useAsyncData('key?', () => $fetch('https://...'))
    // useFetch can handle refs, and functions that return strings,
    // and refetch the content automatically if the ref/function return change
    // since url is in a varible now TS can't infer the type of data, we need to provide as a Generic
    const { data, error } = await useFetch<LessonWithPath>(
      url
    );
      
    if (error.value) {
      throw createError({
        ...error.value,
        statusMessage: `Could not fetch lesson ${lessonSlug} in chapter ${chapterSlug}`,
      });
    }

    lesson.value = data.value
  } else {
    console.log(
    `Getting lesson ${lessonSlug} in chapter ${chapterSlug} from cache`
    )
  }

  return lesson;
};
