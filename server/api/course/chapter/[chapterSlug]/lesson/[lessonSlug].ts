export default defineEventHandler((event) => {
  const chapterSlug = getRouterParam(event, 'chapterSlug');
  const lessonSlug = getRouterParam(event, 'lessonSlug');

  return `Lesson "${lessonSlug}" in chapter "${chapterSlug}"`;
});
