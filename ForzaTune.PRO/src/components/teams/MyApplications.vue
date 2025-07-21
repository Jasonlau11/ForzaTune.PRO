<template>
  <div class="racing-card p-6">
    <h2 class="text-xl font-bold text-white mb-6">{{ $t('teams.myApplications') }}</h2>
    <div v-if="userApplications && userApplications.length > 0" class="space-y-4">
      <div 
        v-for="app in userApplications" 
        :key="app.id"
        class="bg-dark-700 p-4 rounded-lg flex items-center justify-between"
      >
        <div>
          <p class="font-semibold text-gray-200">
            {{ $t('teams.applicationTo') }} <router-link :to="`/teams/${app.teamId}`" class="text-primary-500 hover:underline">{{ app.teamName }}</router-link>
          </p>
          <p class="text-sm text-gray-400">
            {{ $t('common.status') }}: 
            <span :class="statusClass(app.status)">
              {{ $t(`teams.applicationStatus.${app.status}`) }}
            </span>
            - {{ new Date(app.appliedAt).toLocaleDateString() }}
          </p>
        </div>
        <div>
          <button v-if="app.status === 'pending'" @click="withdrawApplication(app.id)" class="btn btn-secondary text-sm">
            {{ $t('teams.applications.withdraw') }}
          </button>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-12">
      <p class="text-gray-400">{{ $t('teams.noPendingApplications') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import type { TeamApplication, ApplicationStatus } from '@/types';

const props = defineProps({
  userApplications: {
    type: Array as PropType<TeamApplication[]>,
    required: true
  }
});

const { t } = useI18n();

const withdrawApplication = (applicationId: string) => {
  console.log('Withdrawing application', applicationId);
  alert(`Application ${applicationId} withdrawn! (This is a placeholder)`);
  // Here you would make an API call and then update the local state
};

const statusClass = (status: ApplicationStatus) => {
  switch (status) {
    case 'pending': return 'text-yellow-400';
    case 'approved': return 'text-green-400';
    case 'rejected': return 'text-red-400';
    case 'withdrawn': return 'text-gray-500';
    default: return 'text-gray-400';
  }
};
</script>
