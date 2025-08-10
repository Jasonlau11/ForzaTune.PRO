<template>
  <div class="racing-card p-6">
    <h3 class="text-xl font-bold text-white mb-4">{{ title }}</h3>
    <div v-if="tunes && tunes.length > 0" class="space-y-4">
      <div v-for="t in tunes" :key="t.id" class="bg-dark-700 p-4 rounded-lg flex justify-between items-center">
        <div>
          <p class="font-semibold text-gray-200">{{ t.shareCode }}</p>
          <p class="text-sm text-gray-400">PI {{ t.finalPI }} • {{ t.piClass }} • {{ t.preference }}</p>
          <p class="text-xs text-gray-500 mt-1">归属：{{ t.ownerXboxId || '-' }}</p>
        </div>
        <div class="flex items-center space-x-2">
          <button class="btn btn-secondary text-sm">{{ $t('common.edit') }}</button>
          <button class="btn btn-danger text-sm">{{ $t('common.delete') }}</button>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-12">
      <p class="text-gray-400 mb-6">{{ $t('profile.tunes.noTunes') }}</p>
      <router-link to="/upload" class="btn btn-primary">
        {{ $t('nav.upload') }}
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { TuneDto } from '@/services/dataService';

defineProps({
  tunes: {
    type: Array as PropType<TuneDto[]>,
    required: true
  },
  title: {
    type: String,
    default: ''
  }
});
</script>
