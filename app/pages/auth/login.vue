<template>
  <div>
    <Head>
      <Title>Login - Reddit Clone</Title>
      <Meta name="description" content="Sign in to your Reddit clone account" />
    </Head>
    <AuthLoginForm />
  </div>
</template>

<script setup lang="ts">
// Use guest middleware to redirect authenticated users
definePageMeta({
  middleware: 'guest'
})
</script>