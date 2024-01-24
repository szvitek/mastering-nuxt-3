export default async (chapterSlug: string, lessonSlug: string) => {
  // useFetch is just a wrapper around await useAsyncData('key?', () => $fetch('https://...'))
  // useFetch can handle refs, and functions that return strings,
  // and refetch the content automatically if the ref/function return change
  const { data, error } = await useFetch(
    `/api/course/chapter/${chapterSlug}/lesson/${lessonSlug}`
  );

  if (error.value) {
    throw createError({
      ...error.value,
      statusMessage: `Could not fetch lesson ${lessonSlug} in chapter ${chapterSlug}`,
    });
  }

  return data;
};
