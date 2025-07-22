<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity"
    @click.self="$emit('close')"
  >
    <div v-if="team" class="racing-card p-8 w-full max-w-lg m-4 transform transition-all" @click.stop>
      <h2 class="text-2xl font-bold text-white mb-2">
        {{ $t('teams.apply.title') }}
      </h2>
      <p class="text-gray-400 mb-6">{{ $t('teams.apply.applyingTo') }} <span class="font-bold text-primary-500">{{ team.name }}</span></p>
      
      <form @submit.prevent="submitApplication" class="space-y-6">
        <div>
          <label for="application-message" class="block text-sm font-medium text-gray-300 mb-2">
            {{ $t('teams.apply.messageLabel') }} ({{ $t('common.optional') }})
          </label>
          <textarea
            id="application-message"
            v-model="message"
            class="input w-full h-28 resize-none"
            :placeholder="$t('teams.apply.messagePlaceholder')"
            maxlength="300"
          ></textarea>
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
          >
            {{ $t('teams.apply.submit') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Team } from '@/types';

const props = defineProps({
  team: {
    type: Object as PropType<Team | null>,
    required: true,
  },
});

const emit = defineEmits(['close', 'submit-application']);
const { t } = useI18n();
const message = ref('');

const submitApplication = () => {
  emit('submit-application', {
    teamId: props.team?.id,
    message: message.value,
  });
};
</script>
