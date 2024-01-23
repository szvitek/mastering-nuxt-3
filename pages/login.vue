<template>
  <div class="prose w-full max-w-2xl h-9">
    <h1>Log in to {{ title }}</h1>
    <button
      class="bg-blue-500 text-white font-bold py-2 px-4 rounded"
      @click="login"
    >
      Log in with Github
    </button>
  </div>
</template>

<script setup lang="ts">
const { title } = useCourse();
const supabase = useSupabaseClient();
// const { query } = useRoute();
// const user = useSupabaseUser();

// nothing happens...
// watchEffect(async () => {
//   if (user.value) {
//     console.log('we');

//     await navigateTo(query.redirectTo as string, {
//       replace: true,
//     });
//   }
// });

const login = async () => {
  // this one doesn't work... supabase has changed a bit since the tutorial was recorded, no workaround found yet
  // const redirectTo = `${window.location.origin}${query.redirectTo}`;
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: 'http://localhost:3000/confirm',
    },
  });

  if (error) {
    console.error(error);
  }
};
</script>
