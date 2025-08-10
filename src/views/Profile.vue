<template>
  <div class="min-h-screen bg-dark-900 text-gray-100">
    <!-- Header -->
    <div class="bg-dark-800 pt-16 relative">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div v-if="user" class="flex items-center space-x-6">
          <div class="w-24 h-24 bg-gradient-to-br from-primary-600 to-primary-800 rounded-full flex items-center justify-center text-4xl text-white font-bold shadow-lg">
            {{ user.xboxId?.charAt(0)?.toUpperCase() || 'U' }}
          </div>
          <div>
            <h1 class="text-3xl font-bold text-white">{{ user.xboxId || 'Unknown User' }}</h1>
            <p class="text-gray-400">{{ user.email || 'No email' }}</p>
            <div class="mt-2 flex items-center space-x-4">
              <span class="px-2 py-1 text-xs font-semibold rounded-full" :class="user.hasLinkedXboxId ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'">
                {{ user.hasLinkedXboxId ? $t('profile.status.verified') : $t('profile.status.standard') }}
              </span>
               <span v-if="user.isProPlayer" class="px-2 py-1 text-xs font-semibold rounded-full bg-racing-gold-500/20 text-racing-gold-300">
                {{ $t('profile.status.pro') }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="sticky top-16 bg-dark-800 z-40 border-y border-racing-silver-600/20">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav class="flex space-x-8 -mb-px">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="activeTab === tab.id ? 'border-primary-500 text-primary-500' : 'border-transparent text-gray-400'"
                class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm hover:text-primary-500 transition-colors focus:outline-none"
              >
                {{ $t(tab.name) }}
              </button>
            </nav>
        </div>
    </div>

    <!-- Tab Content -->
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="user">
        <ProfileSettings v-if="activeTab === 'settings'" :user="user" />
         <MyTunesList v-if="activeTab === 'tunes-uploaded'" :tunes="uploadedTunes" :title="$t('profile.tunes.uploaded') as string" />
         <MyTunesList v-if="activeTab === 'tunes-owned'" :tunes="ownedTunes" :title="$t('profile.tunes.owned') as string" />
        <MyActivity v-if="activeTab === 'activity'" />
        <MyTeamInfo v-if="activeTab === 'team'" :team="userTeam" />
        <ProStatus v-if="activeTab === 'pro'" :is-pro="user.isProPlayer" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuth } from '@/composables/useAuth'
import type { Team } from '@/types'
import { dataService, type TuneDto } from '@/services/dataService'

import ProfileSettings from '@/components/profile/ProfileSettings.vue'
import MyTunesList from '@/components/profile/MyTunesList.vue'
import MyActivity from '@/components/profile/MyActivity.vue'
import MyTeamInfo from '@/components/profile/MyTeamInfo.vue'
import ProStatus from '@/components/profile/ProStatus.vue'

useI18n()
const { user } = useAuth()

type TabId = 'settings' | 'tunes-uploaded' | 'tunes-owned' | 'activity' | 'team' | 'pro';

const activeTab = ref<TabId>('tunes-uploaded');

interface ProfileTab {
  id: TabId;
  name: string;
}

const tabs: ProfileTab[] = [
  { id: 'settings', name: 'profile.tabs.settings' },
  { id: 'tunes-uploaded', name: 'profile.tabs.myUploaded' },
  { id: 'tunes-owned', name: 'profile.tabs.myOwned' },
  { id: 'activity', name: 'profile.tabs.activity' },
  { id: 'team', name: 'profile.tabs.team' },
  { id: 'pro', name: 'profile.tabs.pro' },
];

// 我的上传 与 属于我的 调校
const uploadedTunes = ref<TuneDto[]>([])
const ownedTunes = ref<TuneDto[]>([])
const userTeam = ref<Team | null>(null); // Placeholder

onMounted(async () => {
  if (!user.value) return
  try {
    const [uploaded, owned] = await Promise.all([
      dataService.getMyTunes({ page: 1, limit: 12 }),
      dataService.getOwnedTunes({ page: 1, limit: 12 })
    ])
    uploadedTunes.value = uploaded.items
    ownedTunes.value = owned.items
  } catch (e) {
    console.error('加载我的调校失败', e)
  }
})
</script> 