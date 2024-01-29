type Progress = Record<string, Record<string, boolean>>;

export const useCourseProgress = defineStore('courseProgress', () => {
  // initialize progress from local storage
  const progress = useLocalStorage<Progress>('progress', {});
  const initialized = ref(false);

  async function initialize() {
    // if the course has been already initialized, return
    if (initialized.value) return;
    initialized.value = true;

    // TODO: fetch user progress from endpoint
  }

  const toggleComplete = async (
    chapter: string,
    lesson: string
  ) => {
    // if there's no user we can't update the progress
    const user = useSupabaseUser();
    if (!user.value) return;

    // Grab chapter and lesson slugs from the route if they're not provided
    if (!chapter || !lesson) {
      const {
        params: { chapterSlug, lessonSlug }
      } = useRoute();

      chapter = chapterSlug as string;
      lesson = lessonSlug as string;
    }

    // get the current progress for the lesson
    const currentProgress: boolean = progress.value[chapter]?.[lesson]

    // Optimistically update the progress value in the UI
    progress.value[chapter] = {
      ...progress.value[chapter],
      [lesson]: !currentProgress
    }

    // TODO: Update in DB
  }

  return {
    initialize,
    progress,
    toggleComplete,
  };
});
