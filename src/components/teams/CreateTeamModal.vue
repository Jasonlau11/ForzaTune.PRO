<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity"
    @click.self="$emit('close')"
  >
    <div class="racing-card p-8 w-full max-w-lg m-4 transform transition-all" @click.stop>
      <h2 class="text-2xl font-bold text-white mb-6">{{ $t('teams.create.title') }}</h2>
      <form @submit.prevent="submitForm" class="space-y-6">
        <div>
          <label for="team-name" class="block text-sm font-medium text-gray-300 mb-2">
            {{ $t('team.teamName') }} <span class="text-red-500">*</span>
          </label>
          <input
            id="team-name"
            type="text"
            v-model="teamData.name"
            class="input w-full"
            required
            maxlength="30"
          />
        </div>
        <div>
          <label for="team-description" class="block text-sm font-medium text-gray-300 mb-2">
            {{ $t('team.teamDescription') }}
          </label>
          <textarea
            id="team-description"
            v-model="teamData.description"
            class="input w-full h-24 resize-none"
            maxlength="500"
          ></textarea>
        </div>
        <div class="flex items-center space-x-6 pt-2">
            <label class="flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                v-model="teamData.isPublic" 
                class="form-checkbox h-5 w-5 text-primary-600 bg-dark-700 border-racing-silver-600/50 rounded focus:ring-primary-500"
              />
              <span class="ml-2 text-sm text-gray-300">{{ $t('team.publicTeam') }}</span>
            </label>
            <p class="text-xs text-gray-500">{{ $t('teams.create.publicHelpText') }}</p>
          </div>
          <div class="flex items-center space-x-6">
            <label class="flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                v-model="teamData.requiresApproval" 
                class="form-checkbox h-5 w-5 text-primary-600 bg-dark-700 border-racing-silver-600/50 rounded focus:ring-primary-500"
              />
              <span class="ml-2 text-sm text-gray-300">{{ $t('team.requiresApproval') }}</span>
            </label>
             <p class="text-xs text-gray-500">{{ $t('teams.create.approvalHelpText') }}</p>
          </div>

        <div class="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="btn btn-secondary"
          >
            {{ $t('common.cancel') }}
          </button>
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="!teamData.name"
          >
            {{ $t('teams.create.submit') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const emit = defineEmits(['close', 'create-team']);

const teamData = ref({
  name: '',
  description: '',
  isPublic: true,
  requiresApproval: true,
});

const submitForm = () => {
  if (!teamData.value.name.trim()) {
    alert('Team name is required.');
    return;
  }
  emit('create-team', { ...teamData.value });
};
</script>
