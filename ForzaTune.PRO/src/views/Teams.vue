<template>
  <div class="min-h-screen bg-dark-900 text-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="user?.hasLinkedXboxId">
        <header class="mb-8">
          <h1 class="text-3xl font-bold text-white">{{ $t('teams.title') }}</h1>
          <p class="mt-2 text-gray-400">{{ $t('teams.description') }}</p>
        </header>

        <!-- Tabs -->
        <div class="mb-8 border-b border-racing-silver-600/20">
          <nav class="flex space-x-8 -mb-px">
            <button
              @click="activeTab = 'browse'"
              :class="activeTab === 'browse' ? 'border-primary-500 text-primary-500' : 'border-transparent text-gray-400'"
              class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm hover:text-primary-500 transition-colors focus:outline-none"
            >
              {{ $t('teams.browseTeams') }}
            </button>
            <button
              @click="activeTab = 'my-team'"
              :class="activeTab === 'my-team' ? 'border-primary-500 text-primary-500' : 'border-transparent text-gray-400'"
              class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm hover:text-primary-500 transition-colors focus:outline-none"
            >
              {{ $t('teams.myTeam') }}
            </button>
            <button
              @click="activeTab = 'applications'"
              :class="activeTab === 'applications' ? 'border-primary-500 text-primary-500' : 'border-transparent text-gray-400'"
              class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm hover:text-primary-500 transition-colors focus:outline-none relative"
            >
              {{ $t('teams.myApplications') }}
              <span v-if="userApplications.length > 0" class="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                {{ userApplications.length }}
              </span>
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div>
          <BrowseTeams v-if="activeTab === 'browse'" />
          <MyTeam 
            v-if="activeTab === 'my-team'" 
            :userTeam="userTeam"
            @change-tab="activeTab = $event" 
          />
          <MyApplications v-if="activeTab === 'applications'" :userApplications="userApplications" />
        </div>
      </div>
      <div v-else class="text-center py-16 racing-card">
        <h2 class="text-2xl font-bold text-white">{{ $t('auth.xbox.requiredTitle') }}</h2>
        <p class="text-gray-400 mt-2 mb-6 max-w-md mx-auto">{{ $t('auth.xbox.requiredDescription') }}</p>
        <router-link to="/profile" class="btn btn-primary">
          {{ $t('auth.xbox.linkButton') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Team, TeamApplication } from '@/types';
import { useAuth } from '@/composables/useAuth';

import BrowseTeams from '@/components/teams/BrowseTeams.vue';
import MyTeam from '@/components/teams/MyTeam.vue';
import MyApplications from '@/components/teams/MyApplications.vue';

const { t } = useI18n();
const { user } = useAuth();

type Tab = 'browse' | 'my-team' | 'applications';

const activeTab = ref<Tab>('browse');

// --- Mock Data ---
// In a real application, this data would come from an API
const userTeam = ref<Team | null>(null);
/*
// Example of a user having a team:
const userTeam = ref<Team>({
  id: 'team-speed-demons',
  name: 'Speed Demons',
  description: 'Elite racing team focused on breaking lap records.',
  founderId: 'user1',
  founderGamertag: 'SpeedKing',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-15',
  memberCount: 15,
  maxMembers: 30,
  isPublic: true,
  requiresApproval: true,
  tags: ['Racing', 'Elite'],
  stats: {
    totalTunes: 89,
    totalDownloads: 15420,
    totalLikes: 3890,
    averageRating: 4.7,
    activeMembersCount: 12
  }
});
*/

const userApplications = ref<TeamApplication[]>([
  {
    id: 'app1',
    teamId: 'team-thunder-racers',
    applicantId: 'currentUser',
    applicantGamertag: 'MyGamertag',
    status: 'pending',
    appliedAt: '2024-07-28T10:00:00Z',
    // Mock team info for display
    teamName: 'Thunder Racers',
  }
]);
// --- End Mock Data ---

</script> 