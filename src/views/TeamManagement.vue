<template>
  <div class="min-h-screen bg-dark-900">
    <!-- Header -->
    <div class="bg-dark-800 border-b border-racing-silver-600/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-100">{{ $t('team.management.manageTeam') }}</h1>
            <p class="text-gray-300 mt-1">{{ team?.name }}</p>
          </div>
          <router-link
            :to="`/teams/${teamId}`"
            class="btn btn-secondary"
          >
            {{ $t('common.back') }}
          </router-link>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Tabs -->
      <div class="mb-8">
        <nav class="flex space-x-8">
          <button
            @click="activeTab = 'info'"
            :class="activeTab === 'info' ? 'border-primary-500 text-primary-500' : 'border-transparent text-gray-400'"
            class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm hover:text-primary-500 transition-colors"
          >
            {{ $t('team.management.editTeamInfo') }}
          </button>
          <button
            @click="activeTab = 'members'"
            :class="activeTab === 'members' ? 'border-primary-500 text-primary-500' : 'border-transparent text-gray-400'"
            class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm hover:text-primary-500 transition-colors"
          >
            {{ $t('team.management.memberManagement') }}
          </button>
          <button
            @click="activeTab = 'applications'"
            :class="activeTab === 'applications' ? 'border-primary-500 text-primary-500' : 'border-transparent text-gray-400'"
            class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm hover:text-primary-500 transition-colors relative"
          >
            {{ $t('team.applications.viewApplications') }}
            <span v-if="pendingApplications.length > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {{ pendingApplications.length }}
            </span>
          </button>
        </nav>
      </div>

      <!-- Team Info Tab -->
      <div v-if="activeTab === 'info'" class="racing-card p-6">
        <h2 class="text-xl font-bold text-gray-100 mb-6">{{ $t('team.management.editTeamInfo') }}</h2>
        <form @submit.prevent="updateTeamInfo" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                {{ $t('team.teamName') }}
              </label>
              <input
                type="text"
                v-model="teamForm.name"
                class="input w-full"
                required
                maxlength="30"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                {{ $t('team.maxMembers') }}
              </label>
              <select v-model="teamForm.maxMembers" class="input w-full">
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              {{ $t('team.teamDescription') }}
            </label>
            <textarea
              v-model="teamForm.description"
              class="input w-full h-32 resize-none"
              maxlength="500"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Team Tags
            </label>
            <div class="flex flex-wrap gap-2 mb-2">
              <span 
                v-for="(tag, index) in teamForm.tags" 
                :key="index"
                class="inline-flex items-center px-3 py-1 bg-primary-900/30 text-primary-400 text-sm rounded-full"
              >
                {{ tag }}
                <button 
                  type="button"
                  @click="removeTag(index)"
                  class="ml-2 text-primary-300 hover:text-primary-200"
                >
                  ×
                </button>
              </span>
            </div>
            <div class="flex space-x-2">
              <input
                type="text"
                v-model="newTag"
                @keyup.enter="addTag"
                class="input flex-1"
                placeholder="Add a tag..."
                maxlength="20"
              />
              <button
                type="button"
                @click="addTag"
                class="btn btn-secondary whitespace-nowrap"
                :disabled="!newTag.trim() || teamForm.tags.length >= 5"
              >
                Add Tag
              </button>
            </div>
          </div>

          <div class="flex items-center space-x-6">
            <label class="flex items-center">
              <input 
                type="checkbox" 
                v-model="teamForm.isPublic" 
                class="mr-2"
              />
              <span class="text-sm text-gray-300">{{ $t('team.publicTeam') }}</span>
            </label>
            <label class="flex items-center">
              <input 
                type="checkbox" 
                v-model="teamForm.requiresApproval" 
                class="mr-2"
              />
              <span class="text-sm text-gray-300">{{ $t('team.requiresApproval') }}</span>
            </label>
          </div>

          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="resetForm"
              class="btn btn-secondary"
            >
              Reset
            </button>
            <button
              type="submit"
              class="btn btn-primary"
            >
              {{ $t('common.save') }}
            </button>
          </div>
        </form>
      </div>

      <!-- Members Tab -->
      <div v-if="activeTab === 'members'" class="racing-card p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-gray-100">{{ $t('team.management.memberManagement') }}</h2>
          <button
            @click="showInviteDialog = true"
            class="btn btn-primary"
          >
            {{ $t('team.invitations.invitePlayer') }}
          </button>
        </div>

        <div class="space-y-4">
          <div
            v-for="member in members"
            :key="member.id"
            class="flex items-center justify-between p-4 bg-dark-700 rounded-lg"
          >
            <div class="flex items-center space-x-4">
              <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <span class="text-white font-medium">{{ member.gamertag.charAt(0).toUpperCase() }}</span>
              </div>
              <div>
                <div class="font-medium text-gray-100">{{ member.gamertag }}</div>
                <div class="text-sm text-gray-400">
                  {{ $t(`team.teamRoles.${member.role}`) }} • 
                  {{ $t('tune.author') }}: {{ member.stats.tunesShared }} tunes
                </div>
              </div>
            </div>

            <div class="flex items-center space-x-3">
              <select
                v-if="member.role !== 'owner' && canManageRole"
                v-model="member.role"
                @change="updateMemberRole(member)"
                class="text-sm bg-dark-600 border border-racing-silver-600/30 text-gray-100 rounded px-2 py-1"
              >
                <option value="member">{{ $t('team.teamRoles.member') }}</option>
                <option value="moderator">{{ $t('team.teamRoles.moderator') }}</option>
                <option v-if="currentUserRole === 'owner'" value="admin">{{ $t('team.teamRoles.admin') }}</option>
              </select>
              
              <span v-else class="text-sm text-gray-400">{{ $t(`team.teamRoles.${member.role}`) }}</span>
              
              <div v-if="member.role === 'owner'" class="text-racing-gold-500">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>

              <button
                v-if="member.role !== 'owner' && canKickMembers"
                @click="removeMember(member)"
                class="text-red-400 hover:text-red-300 text-sm"
              >
                {{ $t('team.management.removeMember') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Applications Tab -->
      <div v-if="activeTab === 'applications'" class="racing-card p-6">
        <h2 class="text-xl font-bold text-gray-100 mb-6">{{ $t('team.applications.viewApplications') }}</h2>

        <div v-if="pendingApplications.length === 0" class="text-center py-8">
          <p class="text-gray-400">No pending applications</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="application in pendingApplications"
            :key="application.id"
            class="p-4 bg-dark-700 rounded-lg"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-2">
                  <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                    <span class="text-white text-sm">{{ application.applicantGamertag.charAt(0).toUpperCase() }}</span>
                  </div>
                  <div>
                    <div class="font-medium text-gray-100">{{ application.applicantGamertag }}</div>
                    <div class="text-sm text-gray-400">
                      Applied {{ new Date(application.appliedAt).toLocaleDateString() }}
                    </div>
                  </div>
                </div>
                
                <div v-if="application.message" class="text-sm text-gray-300 bg-dark-800 p-3 rounded mt-3">
                  "{{ application.message }}"
                </div>
              </div>

              <div class="flex space-x-2">
                <button
                  @click="approveApplication(application)"
                  class="btn btn-primary px-3 py-1 text-sm"
                >
                  {{ $t('team.applications.approveApplication') }}
                </button>
                <button
                  @click="rejectApplication(application)"
                  class="btn bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm"
                >
                  {{ $t('team.applications.rejectApplication') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Invite Player Dialog -->
    <div 
      v-if="showInviteDialog"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="showInviteDialog = false"
    >
      <div 
        class="racing-card p-6 w-full max-w-md m-4"
        @click.stop
      >
        <h3 class="text-xl font-bold text-gray-100 mb-4">{{ $t('team.invitations.invitePlayer') }}</h3>
        <form @submit.prevent="sendInvite">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Player Gamertag
              </label>
              <input
                type="text"
                v-model="inviteForm.gamertag"
                class="input w-full"
                placeholder="Enter gamertag..."
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                {{ $t('team.invitations.inviteMessage') }}
              </label>
              <textarea
                v-model="inviteForm.message"
                class="input w-full h-20 resize-none"
                placeholder="Optional invitation message..."
              ></textarea>
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              @click="showInviteDialog = false"
              class="btn btn-secondary"
            >
              {{ $t('common.cancel') }}
            </button>
            <button
              type="submit"
              class="btn btn-primary"
            >
              {{ $t('team.invitations.invite') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { Team, TeamMember, TeamRole, TeamApplication } from '@/types'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

// Reactive state
const activeTab = ref<'info' | 'members' | 'applications'>('info')
const team = ref<Team | null>(null)
const members = ref<TeamMember[]>([])
const applications = ref<TeamApplication[]>([])
const showInviteDialog = ref(false)
const newTag = ref('')

// Current user permissions (mock)
const currentUserRole = ref<TeamRole>('owner')

// Forms
const teamForm = ref({
  name: '',
  description: '',
  maxMembers: 30,
  isPublic: true,
  requiresApproval: false,
  tags: [] as string[]
})

const inviteForm = ref({
  gamertag: '',
  message: ''
})

// Computed properties
const teamId = computed(() => route.params.teamId as string)

const canManageRole = computed(() => {
  return currentUserRole.value === 'owner' || currentUserRole.value === 'admin'
})

const canKickMembers = computed(() => {
  return currentUserRole.value === 'owner' || currentUserRole.value === 'admin'
})

const pendingApplications = computed(() => {
  return applications.value.filter(app => app.status === 'pending')
})

// Methods
const loadTeam = async () => {
  // Mock team data
  team.value = {
    id: teamId.value,
    name: 'Speed Demons',
    description: 'Elite racing team focused on breaking lap records and perfecting high-speed tunes.',
    founderId: 'user1',
    founderGamertag: 'SpeedKing',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15',
    memberCount: 15,
    maxMembers: 30,
    isPublic: true,
    requiresApproval: true,
    tags: ['Racing', 'Speed', 'Elite'],
    stats: {
      totalTunes: 89,
      totalDownloads: 15420,
      totalLikes: 3890,
      averageRating: 4.7,
      activeMembersCount: 12
    }
  }

  // Populate form
  teamForm.value = {
    name: team.value.name,
    description: team.value.description || '',
    maxMembers: team.value.maxMembers,
    isPublic: team.value.isPublic,
    requiresApproval: team.value.requiresApproval,
    tags: [...(team.value.tags || [])]
  }

  // Mock members data
  members.value = [
    {
      id: 'member1',
      teamId: teamId.value,
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
      teamId: teamId.value,
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
    }
  ]

  // Mock applications
  applications.value = [
    {
      id: 'app1',
      teamId: teamId.value,
      applicantId: 'user3',
      applicantGamertag: 'NewRacer',
      message: 'I would love to join your team and contribute my tuning skills!',
      status: 'pending',
      appliedAt: '2024-01-16T10:00:00Z'
    },
    {
      id: 'app2',
      teamId: teamId.value,
      applicantId: 'user4',
      applicantGamertag: 'FastDriver',
      message: 'Looking for a competitive team to improve my racing skills.',
      status: 'pending',
      appliedAt: '2024-01-15T14:30:00Z'
    }
  ]
}

const updateTeamInfo = async () => {
  try {
    // TODO: Implement API call
    console.log('Updating team info:', teamForm.value)
    
    if (team.value) {
      team.value.name = teamForm.value.name
      team.value.description = teamForm.value.description
      team.value.maxMembers = teamForm.value.maxMembers
      team.value.isPublic = teamForm.value.isPublic
      team.value.requiresApproval = teamForm.value.requiresApproval
      team.value.tags = [...teamForm.value.tags]
    }
    
    // Show success message
    alert('Team information updated successfully!')
  } catch (error) {
    console.error('Failed to update team:', error)
  }
}

const resetForm = () => {
  if (team.value) {
    teamForm.value = {
      name: team.value.name,
      description: team.value.description || '',
      maxMembers: team.value.maxMembers,
      isPublic: team.value.isPublic,
      requiresApproval: team.value.requiresApproval,
      tags: [...(team.value.tags || [])]
    }
  }
}

const addTag = () => {
  const tag = newTag.value.trim()
  if (tag && !teamForm.value.tags.includes(tag) && teamForm.value.tags.length < 5) {
    teamForm.value.tags.push(tag)
    newTag.value = ''
  }
}

const removeTag = (index: number) => {
  teamForm.value.tags.splice(index, 1)
}

const updateMemberRole = async (member: TeamMember) => {
  try {
    // TODO: Implement API call
    console.log('Updating member role:', member.gamertag, member.role)
  } catch (error) {
    console.error('Failed to update member role:', error)
  }
}

const removeMember = async (member: TeamMember) => {
  if (confirm(`Are you sure you want to remove ${member.gamertag} from the team?`)) {
    try {
      // TODO: Implement API call
      console.log('Removing member:', member.gamertag)
      const index = members.value.findIndex(m => m.id === member.id)
      if (index !== -1) {
        members.value.splice(index, 1)
      }
    } catch (error) {
      console.error('Failed to remove member:', error)
    }
  }
}

const sendInvite = async () => {
  try {
    // TODO: Implement API call
    console.log('Sending invite:', inviteForm.value)
    
    showInviteDialog.value = false
    inviteForm.value = { gamertag: '', message: '' }
    
    alert('Invitation sent successfully!')
  } catch (error) {
    console.error('Failed to send invite:', error)
  }
}

const approveApplication = async (application: TeamApplication) => {
  try {
    // TODO: Implement API call
    console.log('Approving application:', application.applicantGamertag)
    
    application.status = 'approved'
    
    // Add new member
    const newMember: TeamMember = {
      id: `member-${Date.now()}`,
      teamId: teamId.value,
      userId: application.applicantId,
      gamertag: application.applicantGamertag,
      role: 'member',
      joinedAt: new Date().toISOString(),
      permissions: [],
      stats: {
        tunesShared: 0,
        downloadsReceived: 0,
        likesReceived: 0,
        contributionScore: 0
      }
    }
    
    members.value.push(newMember)
  } catch (error) {
    console.error('Failed to approve application:', error)
  }
}

const rejectApplication = async (application: TeamApplication) => {
  if (confirm(`Are you sure you want to reject ${application.applicantGamertag}'s application?`)) {
    try {
      // TODO: Implement API call
      console.log('Rejecting application:', application.applicantGamertag)
      
      application.status = 'rejected'
    } catch (error) {
      console.error('Failed to reject application:', error)
    }
  }
}

onMounted(() => {
  loadTeam()
})
</script> 