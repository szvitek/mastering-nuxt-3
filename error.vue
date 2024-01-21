<template>
  <NuxtLayout>
    <div class="prose">
      <template v-if="error.statusCode === 404">
        <h1>404</h1>
        <p>I guess that page doesn't exist.</p>
      </template>

      <template v-else>
        <h1>Dang</h1>
        <p>
          <strong>{{ error.message }}</strong>
        </p>
        <p>It looks like something broke.</p>
        <p>Sorry about that.</p>
      </template>
    </div>
  </NuxtLayout>
</template>

<script setup>
const error = useError();
</script>
