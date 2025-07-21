<template>
  <div class="racing-card p-6">
    <h3 class="text-xl font-bold text-white mb-4">{{ $t('profile.tunes.title') }}</h3>
    <div v-if="tunes && tunes.length > 0">
      <div class="space-y-4">
        <!-- Placeholder for tune list -->
        <div v-for="n in 3" :key="n" class="bg-dark-700 p-4 rounded-lg flex justify-between items-center">
            <div>
                <p class="font-semibold text-gray-200">Placeholder Tune {{ n }}</p>
                <p class="text-sm text-gray-400">McLaren P1 - S2 998</p>
            </div>
             <div class="flex items-center space-x-2">
                <button class="btn btn-secondary text-sm">{{ $t('common.edit') }}</button>
                <button class="btn btn-danger text-sm">{{ $t('common.delete') }}</button>
            </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-12">
      <p class="text-gray-400">{{ $t('profile.tunes.noTunes') }}</p>
      <router-link to="/upload" class="btn btn-primary mt-4">
        {{ $t('nav.upload') }}
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { Tune } from '@/types';

defineProps({
  tunes: {
    type: Array as PropType<Tune[]>,
    required: true
  }
});
</script>
