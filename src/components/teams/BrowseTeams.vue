<template>
  <div>
    <div class="mb-6">
      <input
        type="text"
        v-model="searchQuery"
        :placeholder="$t('teams.searchPlaceholder')"
        class="input w-full md:w-1/2"
      />
    </div>

    <div v-if="filteredTeams.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="team in filteredTeams" 
        :key="team.id" 
        class="racing-card p-6 flex flex-col cursor-pointer hover:border-primary-500/50 border-transparent border transition-all duration-300 transform hover:-translate-y-1"
        @click="viewTeamDetails(team)"
      >
        <div class="flex-grow">
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-xl font-bold text-white">{{ team.name }}</h3>
            <span class="text-sm px-2 py-1 rounded flex-shrink-0" :class="team.isPublic ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'">
              {{ team.isPublic ? $t('team.publicTeam') : $t('team.privateTeam') }}
            </span>
          </div>
          <p class="text-gray-400 text-sm mb-4 h-10 overflow-hidden">
            {{ team.description }}
          </p>
          <div class="flex items-center space-x-4 text-sm text-gray-300 mb-4">
            <span>{{ team.memberCount }}/{{ team.maxMembers }} {{ $t('team.members') }}</span>
            <span>{{ team.stats.totalTunes }} {{ $t('team.totalTunes') }}</span>
          </div>
           <div class="flex flex-wrap gap-2">
              <span 
                v-for="tag in team.tags" 
                :key="tag"
                class="px-3 py-1 bg-primary-900/30 text-primary-400 text-xs rounded-full"
              >
                {{ tag }}
              </span>
            </div>
        </div>
        <div class="mt-6">
           <button @click.stop="openApplyModal(team)" class="btn btn-primary w-full">
            {{ $t('team.applications.apply') }}
          </button>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-12">
      <p class="text-gray-400">{{ $t('common.noResults') }}</p>
    </div>
    
    <ApplyToTeamModal
      v-if="isApplyModalOpen"
      :team="selectedTeamForApply"
      @close="isApplyModalOpen = false"
      @submit-application="handleSubmitApplication"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import type { Team } from '@/types';
import ApplyToTeamModal from './ApplyToTeamModal.vue';

const { t } = useI18n();
const router = useRouter();

const searchQuery = ref('');
const isApplyModalOpen = ref(false);
const selectedTeamForApply = ref<Team | null>(null);

// Mock Data
const publicTeams = ref<Team[]>([
  {
    id: 'team-thunder-racers',
    name: 'Thunder Racers',
    description: 'A team for competitive racers who love thunderous speed and sharp turns.',
    founderId: 'user2',
    founderGamertag: 'RacerX',
    createdAt: '2023-11-10',
    updatedAt: '2024-06-01',
    memberCount: 25,
    maxMembers: 30,
    isPublic: true,
    requiresApproval: true,
    tags: ['Competitive', 'Drift', 'Street Racing'],
    stats: { totalTunes: 120, totalDownloads: 25000, totalLikes: 8000, averageRating: 4.8, activeMembersCount: 22 }
  },
  {
    id: 'team-offroad-legends',
    name: 'Offroad Legends',
    description: 'Masters of dirt, mud, and everything off-road. Join us to conquer the wild terrains.',
    founderId: 'user3',
    founderGamertag: 'DirtDevil',
    createdAt: '2023-05-20',
    updatedAt: '2024-07-15',
    memberCount: 45,
    maxMembers: 50,
    isPublic: true,
    requiresApproval: false,
    tags: ['Offroad', 'Rally', 'Adventure'],
    stats: { totalTunes: 250, totalDownloads: 45000, totalLikes: 12000, averageRating: 4.9, activeMembersCount: 40 }
  },
  {
    id: 'team-midnight-cruisers',
    name: 'Midnight Cruisers',
    description: 'Casual cruising and stylish driving. We own the night.',
    founderId: 'user4',
    founderGamertag: 'NightRider',
    createdAt: '2024-02-01',
    updatedAt: '2024-07-01',
    memberCount: 18,
    maxMembers: 50,
    isPublic: false,
    requiresApproval: true,
    tags: ['Cruising', 'JDM', 'Style'],
    stats: { totalTunes: 50, totalDownloads: 8000, totalLikes: 3000, averageRating: 4.5, activeMembersCount: 15 }
  },
]);

const filteredTeams = computed(() => {
  if (!searchQuery.value) {
    return publicTeams.value;
  }
  const lowerCaseQuery = searchQuery.value.toLowerCase();
  return publicTeams.value.filter(team =>
    team.name.toLowerCase().includes(lowerCaseQuery) ||
    (team.tags && team.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery)))
  );
});

const viewTeamDetails = (team: Team) => {
  router.push(`/teams/${team.id}`);
};

const openApplyModal = (team: Team) => {
  selectedTeamForApply.value = team;
  isApplyModalOpen.value = true;
};

const handleSubmitApplication = (applicationData: { teamId: string; message: string }) => {
  console.log('Submitting application:', applicationData);
  // API call would go here
  alert(`Application to team ${applicationData.teamId} submitted with message: "${applicationData.message}"`);
  isApplyModalOpen.value = false;
};
</script>
