<template>
  <NuxtLayout>
    <div class="prose">
      <template v-if="error?.statusCode === 404">
        <h1>404</h1>
        <p>I guess that page doesn't exist.</p>
        <p>
          <strong>{{ error.message }}</strong>
        </p>
      </template>

      <template v-else>
        <h1>Dang</h1>
        <p>It looks like something broke.</p>
        <p>Sorry about that.</p>
        <p>
          <strong>{{ error.message }}</strong>
        </p>
      </template>
      <p>
        Go to the
        <a class="hover:cursor-pointer" @click="handleError"> first lesson. </a>
      </p>
    </div>
  </NuxtLayout>
</template>

<script setup>
const error = useError();
const handleError = () => {
  // for some reason this functinality is not working as intended for server errors... :(
  // it clears the error but doesn't redirect (Uncaught (in promise) TypeError: node is null)
  // no workaround yet
  clearError({
    redirect:
      '/course/chapter/1-chapter-1/lesson/1-introduction-to-typescript-with-vue-js-3',
  });
};
</script>
