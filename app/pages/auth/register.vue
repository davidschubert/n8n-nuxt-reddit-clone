<template>
  <div>
    <Head>
      <Title>Register - Reddit Clone</Title>
      <Meta name="description" content="Create a new account to join our Reddit clone community" />
    </Head>
    <AuthRegisterForm />
  </div>
</template>

<script setup lang="ts">
// Use guest middleware to redirect authenticated users
definePageMeta({
  middleware: 'guest'
})
</script>