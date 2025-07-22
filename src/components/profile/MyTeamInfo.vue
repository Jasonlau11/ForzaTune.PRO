<template>
  <div class="racing-card p-6">
    <h3 class="text-xl font-bold text-white mb-4">{{ $t('profile.team.title') }}</h3>
    <div v-if="team">
      <!-- Display team info -->
      <p>Team: {{ team.name }}</p>
    </div>
    <div v-else class="text-center py-16">
      <div class="space-y-8">
        <p class="text-gray-400 text-lg leading-relaxed">{{ $t('profile.team.noTeam') }}</p>
        <div class="pt-4">
          <router-link to="/teams" class="btn btn-primary inline-block">
            {{ $t('teams.browseTeams') }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { Team } from '@/types';

defineProps({
  team: {
    type: Object as PropType<Team | null>,
    default: null
  }
});
</script>
