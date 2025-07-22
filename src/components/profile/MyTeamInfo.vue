<template>
  <div class="racing-card p-6">
    <h3 class="text-xl font-bold text-white mb-4">{{ $t('profile.team.title') }}</h3>
    <div v-if="team">
      <!-- Display team info -->
      <p>Team: {{ team.name }}</p>
    </div>
    <div v-else class="text-center py-12">
      <p class="text-gray-400 mb-6">{{ $t('profile.team.noTeam') }}</p>
      <router-link to="/teams" class="btn btn-primary">
        {{ $t('teams.browseTeams') }}
      </router-link>
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
