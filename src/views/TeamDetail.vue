<template>
  <div class="min-h-screen bg-dark-900" v-if="team">
    <!-- Team Header -->
    <div class="relative h-64 bg-gradient-to-r from-primary-600 to-primary-700 overflow-hidden">
      <img 
        v-if="team.bannerUrl" 
        :src="team.bannerUrl" 
        :alt="team.name"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      <div class="absolute bottom-6 left-6 flex items-center space-x-6">
        <div class="w-20 h-20 bg-gradient-to-br from-racing-gold-500 to-racing-gold-600 rounded-xl flex items-center justify-center">
          <span class="text-dark-900 font-bold text-2xl">{{ team.name.charAt(0).toUpperCase() }}</span>
        </div>
        <div>
          <h1 class="text-3xl font-bold text-white mb-2">{{ team.name }}</h1>
          <p class="text-gray-200">{{ $t('team.founder') }}: {{ team.founderGamertag }}</p>
          <div class="flex items-center space-x-4 text-sm text-gray-200 mt-1">
            <span>{{ team.memberCount }}/{{ team.maxMembers }} {{ $t('team.members') }}</span>
            <span>{{ team.stats.totalTunes }} {{ $t('team.totalTunes') }}</span>
            <span v-if="team.isPublic" class="px-2 py-1 bg-green-900/50 text-green-300 rounded">
              {{ $t('team.publicTeam') }}
            </span>
          </div>
        </div>
      </div>
      
      <!-- Action Buttons -->
      <div class="absolute top-6 right-6 flex space-x-3">
        <button
          v-if="canManageTeam"
          @click="$router.push(`/teams/${team.id}/manage`)"
          class="btn btn-secondary"
        >
          {{ $t('team.management.manageTeam') }}
        </button>
        <button
          v-if="!isMember && !hasApplied"
          @click="applyToTeam"
          class="btn btn-primary"
        >
          {{ $t('team.applications.apply') }}
        </button>
        <button
          v-if="isMember && userRole !== 'owner'"
          @click="leaveTeam"
          class="btn bg-red-600 hover:bg-red-700 text-white"
        >
          {{ $t('team.management.leaveTeam') }}
        </button>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Team Description -->
          <div class="racing-card p-6">
            <h2 class="text-xl font-bold text-gray-100 mb-4">{{ $t('team.teamDescription') }}</h2>
            <p class="text-gray-300 leading-relaxed">
              {{ team.description || 'This team has not provided a description yet.' }}
            </p>
            
            <!-- Team Tags -->
            <div v-if="team.tags && team.tags.length > 0" class="mt-4">
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="tag in team.tags" 
                  :key="tag"
                  class="px-3 py-1 bg-primary-900/30 text-primary-400 text-sm rounded-full"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>

          <!-- Team Tunes -->
          <div class="racing-card p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-bold text-gray-100">{{ $t('team.totalTunes') }}</h2>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-400">{{ filteredTunes.length }} {{ $t('tune.availableTunes') }}</span>
              </div>
            </div>

            <!-- Tune Filters -->
            <div class="flex space-x-4 mb-4 text-sm">
              <button
                @click="tuneFilter = 'all'"
                :class="tuneFilter === 'all' ? 'text-primary-500' : 'text-gray-400'"
                class="hover:text-primary-500 transition-colors"
              >
                {{ $t('common.all') }}
              </button>
              <button
                @click="tuneFilter = 'public'"
                :class="tuneFilter === 'public' ? 'text-primary-500' : 'text-gray-400'"
                class="hover:text-primary-500 transition-colors"
              >
                {{ $t('team.tuneSettings.public') }}
              </button>
              <button
                v-if="isMember"
                @click="tuneFilter = 'team_only'"
                :class="tuneFilter === 'team_only' ? 'text-primary-500' : 'text-gray-400'"
                class="hover:text-primary-500 transition-colors"
              >
                {{ $t('team.tuneSettings.teamOnly') }}
              </button>
            </div>

            <!-- Tunes List -->
            <div class="space-y-4">
              <div
                v-for="tune in filteredTunes.slice(0, 10)"
                :key="tune.id"
                class="bg-dark-700 rounded-lg p-4 hover:bg-dark-600 transition-colors cursor-pointer"
                @click="$router.push(`/tunes/${tune.id}`)"
              >
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <h3 class="font-semibold text-gray-100">{{ tune.carName }}</h3>
                    <p class="text-sm text-gray-300">{{ $t('tune.author') }}: {{ tune.authorGamertag }}</p>
                    <div class="flex items-center space-x-4 text-xs text-gray-400 mt-2">
                      <span>{{ tune.likeCount }} {{ $t('common.likes') }}</span>
                      <span v-if="tune.bestLapTime" class="text-racing-gold-500">{{ tune.bestLapTime }}</span>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span 
                      v-if="tune.teamSettings?.teamVisibilityLevel === 'team_only'"
                      class="px-2 py-1 bg-yellow-900/30 text-yellow-400 text-xs rounded"
                    >
                      {{ $t('team.tuneSettings.teamOnly') }}
                    </span>
                    <PIClassBadge :pi-class="tune.piClass" :pi="tune.finalPI" />
                  </div>
                </div>
              </div>
            </div>

            <div v-if="filteredTunes.length === 0" class="text-center py-8">
              <p class="text-gray-400">{{ $t('common.noData') }}</p>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Team Stats -->
          <div class="racing-card p-6">
            <h3 class="text-lg font-bold text-gray-100 mb-4">{{ $t('team.teamStats') }}</h3>
            <div class="space-y-4">
              <div class="flex justify-between">
                <span class="text-gray-400">{{ $t('team.totalTunes') }}</span>
                <span class="text-primary-500 font-medium">{{ team.stats.totalTunes }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">{{ $t('team.totalDownloads') }}</span>
                <span class="text-racing-gold-500 font-medium">{{ team.stats.totalDownloads.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">{{ $t('team.totalLikes') }}</span>
                <span class="text-red-400 font-medium">{{ team.stats.totalLikes.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">{{ $t('team.averageRating') }}</span>
                <span class="text-yellow-400 font-medium">{{ team.stats.averageRating.toFixed(1) }}/5.0</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">{{ $t('team.activeMembers') }}</span>
                <span class="text-green-400 font-medium">{{ team.stats.activeMembersCount }}</span>
              </div>
            </div>
          </div>

          <!-- Team Members -->
          <div class="racing-card p-6">
            <h3 class="text-lg font-bold text-gray-100 mb-4">
              {{ $t('team.members') }} ({{ members.length }})
            </h3>
            <div class="space-y-3">
              <div
                v-for="member in members.slice(0, 10)"
                :key="member.id"
                class="flex items-center space-x-3"
              >
                <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                  <span class="text-white text-sm font-medium">{{ member.gamertag.charAt(0).toUpperCase() }}</span>
                </div>
                <div class="flex-1">
                  <div class="font-medium text-gray-100">{{ member.gamertag }}</div>
                  <div class="text-xs text-gray-400">{{ $t(`team.teamRoles.${member.role}`) }}</div>
                </div>
                <div v-if="member.role === 'owner'" class="text-racing-gold-500">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div v-if="members.length > 10" class="mt-4 text-center">
              <button class="text-primary-500 hover:text-primary-400 text-sm">
                查看全部成员
              </button>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="racing-card p-6">
            <h3 class="text-lg font-bold text-gray-100 mb-4">最近活动</h3>
            <div class="space-y-3 text-sm">
              <div class="flex items-start space-x-2">
                <div class="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span class="text-gray-300">SpeedKing</span>
                  <span class="text-gray-400"> 分享了新调校</span>
                  <div class="text-xs text-gray-500">2 小时前</div>
                </div>
              </div>
              <div class="flex items-start space-x-2">
                <div class="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span class="text-gray-300">RacerX</span>
                  <span class="text-gray-400"> 加入了车队</span>
                  <div class="text-xs text-gray-500">1 天前</div>
                </div>
              </div>
              <div class="flex items-start space-x-2">
                <div class="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span class="text-gray-300">TeamEvent</span>
                  <span class="text-gray-400"> 刷新了最快圈速</span>
                  <div class="text-xs text-gray-500">3 天前</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Loading State -->
  <div v-else class="min-h-screen bg-dark-900 flex items-center justify-center">
    <div class="text-center">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      <p class="mt-2 text-gray-300">{{ $t('common.loading') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { Team, TeamMember, TeamRole, TeamTune } from '@/types'
import PIClassBadge from '@/components/common/PIClassBadge.vue'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

// Reactive state
const team = ref<Team | null>(null)
const members = ref<TeamMember[]>([])
const teamTunes = ref<TeamTune[]>([])
const tuneFilter = ref<'all' | 'public' | 'team_only'>('all')

// User state (mock)
const currentUserId = ref('user1')
const userRole = ref<TeamRole>('member')
const isMember = ref(false)
const hasApplied = ref(false)

// Computed properties
const canManageTeam = computed(() => {
  return isMember.value && (userRole.value === 'owner' || userRole.value === 'admin')
})

const filteredTunes = computed(() => {
  if (tuneFilter.value === 'all') {
    return teamTunes.value.filter(tune => 
      tune.teamSettings?.teamVisibilityLevel === 'public' || isMember.value
    )
  } else if (tuneFilter.value === 'public') {
    return teamTunes.value.filter(tune => 
      tune.teamSettings?.teamVisibilityLevel === 'public'
    )
  } else if (tuneFilter.value === 'team_only') {
    return teamTunes.value.filter(tune => 
      tune.teamSettings?.teamVisibilityLevel === 'team_only'
    )
  }
  return []
})

// Methods
const loadTeam = async () => {
  const teamId = route.params.teamId as string
  
  // Mock team data
  team.value = {
    id: teamId,
    name: 'Speed Demons',
    description: 'Elite racing team focused on breaking lap records and perfecting high-speed tunes. We are a community of dedicated racers who push the limits of automotive performance.',
    founderId: 'user1',
    founderGamertag: 'SpeedKing',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15',
    memberCount: 15,
    maxMembers: 30,
    isPublic: true,
    requiresApproval: true,
    tags: ['Racing', 'Speed', 'Elite', 'Competition'],
    stats: {
      totalTunes: 89,
      totalDownloads: 15420,
      totalLikes: 3890,
      averageRating: 4.7,
      activeMembersCount: 12
    }
  }

  // Mock members data
  members.value = [
    {
      id: 'member1',
      teamId: teamId,
      userId: 'user1',
      gamertag: 'SpeedKing',
      role: 'owner',
      joinedAt: '2024-01-01',
      permissions: ['manage_members', 'manage_tunes', 'edit_team_info'],
      stats: {
        tunesShared: 25,
        downloadsReceived: 5420,
        likesReceived: 1230,
        contributionScore: 95
      }
    },
    {
      id: 'member2',
      teamId: teamId,
      userId: 'user2',
      gamertag: 'RacerX',
      role: 'admin',
      joinedAt: '2024-01-02',
      permissions: ['manage_members', 'invite_members'],
      stats: {
        tunesShared: 18,
        downloadsReceived: 3200,
        likesReceived: 890,
        contributionScore: 82
      }
    },
    {
      id: 'member3',
      teamId: teamId,
      userId: 'user3',
      gamertag: 'TuneExpert',
      role: 'member',
      joinedAt: '2024-01-05',
      permissions: [],
      stats: {
        tunesShared: 12,
        downloadsReceived: 2100,
        likesReceived: 560,
        contributionScore: 67
      }
    }
  ]

  // Mock team tunes
  teamTunes.value = [
    {
      id: 'tune1',
      carId: 'car1',
      carName: 'McLaren P1',
      authorId: 'user1',
      authorGamertag: 'SpeedKing',
      shareCode: 'SPD-123-456',
      piClass: 'X',
      finalPI: 999,
      preference: 'Speed',
      likeCount: 340,
      bestLapTime: '2:15.342',
      teamId: teamId,
      teamName: 'Speed Demons',
      teamSettings: {
        isTeamShared: true,
        allowTeamEdit: false,
        allowTeamDownload: true,
        teamVisibilityLevel: 'public'
      }
    },
    {
      id: 'tune2',
      carId: 'car2',
      carName: 'Koenigsegg Jesko',
      authorId: 'user2',
      authorGamertag: 'RacerX',
      shareCode: 'RAC-789-012',
      piClass: 'X',
      finalPI: 998,
      preference: 'Balance',
      likeCount: 210,
      bestLapTime: '2:16.124',
      teamId: teamId,
      teamName: 'Speed Demons',
      teamSettings: {
        isTeamShared: true,
        allowTeamEdit: true,
        allowTeamDownload: true,
        teamVisibilityLevel: 'team_only'
      }
    }
  ]

  // Check if current user is a member
  const currentUserMember = members.value.find(m => m.userId === currentUserId.value)
  if (currentUserMember) {
    isMember.value = true
    userRole.value = currentUserMember.role
  }
}

const applyToTeam = () => {
  // TODO: Implement team application logic
  console.log('Applying to team:', team.value?.name)
  hasApplied.value = true
}

const leaveTeam = () => {
  // TODO: Implement leave team logic
  console.log('Leaving team:', team.value?.name)
}

onMounted(() => {
  loadTeam()
})
</script> 