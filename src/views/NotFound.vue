<template>
  <div class="min-h-screen bg-dark-900 flex items-center justify-center relative overflow-hidden">
    <div class="absolute inset-0 bg-gradient-racing opacity-20"></div>
    <div class="text-center relative z-10">
      <div class="text-9xl font-bold text-gradient bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
        404
      </div>
      <h2 class="text-2xl font-bold text-gray-100 mt-4 text-shadow">Page Not Found</h2>
      <p class="text-gray-300 mt-2 mb-8">
        The page you're looking for doesn't exist.
      </p>
      <router-link to="/" class="btn btn-primary hover-glow">
        Go Home
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// 404 page component
</script> 