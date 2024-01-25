import { StorageSerializers } from '@vueuse/core';

export default async <T>(url: string) => {
  // use sessionStorage to cache the lesson data
  const cached = useSessionStorage<T>(url, null, {
    // by passing null as default it can't automatically
    // determinde which seializer to use
    serializer: StorageSerializers.object,
  });

  if (!cached.value) {
    // useFetch is just a wrapper around await useAsyncData('key?', () => $fetch('https://...'))
    // useFetch can handle refs, and functions that return strings,
    // and refetch the content automatically if the ref/function return change
    // since url is in a varible now TS can't infer the type of data, we need to provide as a Generic
    const { data, error } = await useFetch<T>(url);

    if (error.value) {
      throw createError({
        ...error.value,
        statusMessage: `Could not fetch data from ${url}`,
      });
    }

    cached.value = data.value as T;
  } else {
    console.log(`Getting value from cache for ${url}`);
  }

  return cached;
};
