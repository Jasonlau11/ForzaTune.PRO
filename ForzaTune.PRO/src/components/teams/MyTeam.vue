<template>
  <div>
    <div v-if="userTeam" class="racing-card p-6">
      <h2 class="text-2xl font-bold text-white mb-2">{{ userTeam.name }}</h2>
      <p class="text-gray-400 text-sm mb-6">{{ userTeam.description }}</p>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-6">
        <div>
          <p class="text-2xl font-bold text-primary-500">{{ userTeam.memberCount }}</p>
          <p class="text-sm text-gray-400">{{ $t('team.members') }}</p>
        </div>
        <div>
          <p class="text-2xl font-bold text-racing-gold-500">{{ userTeam.stats.totalTunes }}</p>
          <p class="text-sm text-gray-400">{{ $t('team.totalTunes') }}</p>
        </div>
        <div>
          <p class="text-2xl font-bold text-red-500">{{ userTeam.stats.totalLikes.toLocaleString() }}</p>
          <p class="text-sm text-gray-400">{{ $t('common.likes') }}</p>
        </div>
        <div>
          <p class="text-2xl font-bold text-blue-500">{{ userTeam.stats.totalDownloads.toLocaleString() }}</p>
          <p class="text-sm text-gray-400">{{ $t('tune.downloads') }}</p>
        </div>
      </div>
      
      <div class="flex justify-end space-x-3">
        <router-link :to="`/teams/${userTeam.id}/manage`" class="btn btn-secondary">
          {{ $t('team.management.manageTeam') }}
        </router-link>
         <router-link :to="`/teams/${userTeam.id}`" class="btn btn-primary">
          {{ $t('teams.viewTeamPage') }}
        </router-link>
      </div>
    </div>

    <div v-else class="text-center py-16 racing-card">
      <h3 class="text-2xl font-bold text-white">{{ $t('teams.noTeam.title') }}</h3>
      <p class="text-gray-400 mt-2 mb-6 max-w-md mx-auto">{{ $t('teams.noTeam.description') }}</p>
      <div class="flex justify-center space-x-4">
        <button @click="isModalOpen = true" class="btn btn-primary">
          {{ $t('teams.create.title') }}
        </button>
        <button @click="$emit('change-tab', 'browse')" class="btn btn-secondary">
          {{ $t('teams.browseTeams') }}
        </button>
      </div>
    </div>
    
    <CreateTeamModal 
      v-if="isModalOpen" 
      @close="isModalOpen = false"
      @create-team="handleCreateTeam"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Team } from '@/types';
import CreateTeamModal from './CreateTeamModal.vue';

const props = defineProps({
  userTeam: {
    type: Object as PropType<Team | null>,
    default: null
  }
});

const emit = defineEmits(['change-tab']);

const { t } = useI18n();

const isModalOpen = ref(false);

const handleCreateTeam = (teamData: { name: string; description: string; isPublic: boolean; requiresApproval: boolean; }) => {
  console.log('Creating team with data:', teamData);
  // Here you would make an API call to create the team
  alert(`Team "${teamData.name}" created! (This is a placeholder)`);
  isModalOpen.value = false;
  // Potentially refresh user data to get the new team info
};

</script>
