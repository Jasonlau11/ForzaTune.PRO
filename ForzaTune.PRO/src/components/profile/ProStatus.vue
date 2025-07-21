<template>
  <div class="racing-card p-6">
    <h3 class="text-xl font-bold text-white mb-4">{{ $t('profile.pro.title') }}</h3>
    <div v-if="isPro" class="text-center py-12">
        <span class="text-5xl">🏆</span>
        <p class="mt-4 text-2xl font-bold text-racing-gold-400">{{ $t('profile.pro.isPro') }}</p>
        <p class="text-gray-400">{{ $t('profile.pro.proSince') }} 2024-01-01</p>
    </div>
    <div v-else class="text-center py-12">
      <p class="text-gray-400">{{ $t('profile.pro.notPro') }}</p>
      <router-link to="/pro-application" class="btn btn-primary mt-4">
        {{ $t('nav.proApplication') }}
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  isPro: {
    type: Boolean,
    required: true
  }
});
</script>
