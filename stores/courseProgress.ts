export const useCourseProgress = defineStore('courseProgress', () => {
  // initialize progress from local storage
  const progress = ref<CourseProgress>({});
  const initialized = ref(false);

  async function initialize() {
    // if the course has been already initialized, return
    if (initialized.value) return;
    
    // fetch user progress from endpoint
    const { data: userProgress } = await useFetch<CourseProgress>('/api/user/progress', {
      headers: useRequestHeaders(['cookie'])
    });
    
    // update progress value
    if (userProgress.value) {
      progress.value = userProgress.value
    }
    
    initialized.value = true;
  }

  // toggle the progress of a lesson based on chapter slug and lesson slug
  const toggleComplete = async (chapter: string, lesson: string) => {
    // if there's no user we can't update the progress
    const user = useSupabaseUser();
    if (!user.value) return;

    // Grab chapter and lesson slugs from the route if they're not provided
    if (!chapter || !lesson) {
      const {
        params: { chapterSlug, lessonSlug },
      } = useRoute();

      chapter = chapterSlug as string;
      lesson = lessonSlug as string;
    }

    // get the current progress for the lesson
    const currentProgress: boolean = progress.value[chapter]?.[lesson];

    // Optimistically update the progress value in the UI
    progress.value[chapter] = {
      ...progress.value[chapter],
      [lesson]: !currentProgress,
    };

    // Update in DB
    try {
      await $fetch(`/api/course/chapter/${chapter}/lesson/${lesson}/progress`, {
        method: 'POST',
        // automatically stringified by $fetch
        body: {
          completed: !currentProgress,
        },
      });
    } catch (error) {
      console.error(error);

      // if the request faild, revert the progress value
      progress.value[chapter] = {
        ...progress.value[chapter],
        [lesson]: currentProgress,
      };
    }
  };

  return {
    initialize,
    progress,
    toggleComplete,
  };
});
