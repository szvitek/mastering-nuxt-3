<template>
  <div>redirecting...</div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const user = useSupabaseUser();

watchEffect(async () => {
  if (user.value) {
    const route = useRoute();
    await useFetch(`/api/user/linkWithPurchase/${route.params.paymentId}`, {
      headers: useRequestHeaders(['cookie']),
    });

    await navigateTo('/', {
      replace: true,
    });
  }
});

// const render = () => {};
</script>
