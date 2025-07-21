<template>
  <div class="space-y-8">
    <!-- Account Information -->
    <div class="racing-card p-6">
      <h3 class="text-xl font-bold text-white mb-4">{{ $t('profile.settings.accountInfo') }}</h3>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-400">{{ $t('auth.email') }}</label>
          <p class="text-gray-200">{{ user.email }}</p>
        </div>
      </div>
    </div>
    
    <!-- Xbox Gamertag Linking -->
    <div class="racing-card p-6">
      <h3 class="text-xl font-bold text-white mb-2">{{ $t('auth.xbox.title') }}</h3>
      
      <!-- Already Linked View -->
      <div v-if="user.hasLinkedXboxId">
          <p class="text-sm text-gray-400 mb-4">{{ $t('profile.xbox.linkedDesc') }}</p>
          <div class="flex items-center justify-between bg-dark-700 p-4 rounded-lg">
            <div class="flex items-center space-x-3">
               <span class="text-2xl">✓</span>
               <span class="font-bold text-green-400">{{ user.gamertag }}</span>
            </div>
            <button class="btn btn-danger text-sm" @click="unlinkXbox">{{ $t('profile.xbox.unlink') }}</button>
        </div>
      </div>
      
      <!-- Not Linked View -->
      <div v-else>
        <p class="text-sm text-gray-400 mb-4">{{ $t('profile.xbox.notLinkedDesc') }}</p>
        <div class="space-y-4">
            <div>
              <label for="gamertag" class="sr-only">{{ $t('auth.xbox.gamertag') }}</label>
              <div class="flex space-x-2">
                <input id="gamertag" type="text" v-model="gamertag" class="input flex-grow" :placeholder="$t('auth.xbox.gamertag')" :disabled="verificationSent" />
                 <button type="button" @click="sendVerification" class="btn btn-secondary whitespace-nowrap" :disabled="!gamertag || verificationSent || isLoading">
                    {{ verificationSent ? $t('auth.xbox.sent') : $t('auth.xbox.verify') }}
                </button>
              </div>
            </div>
            <div v-if="verificationSent">
                <p class="text-green-400 text-sm mb-2">{{ $t('auth.xbox.sentMessage') }}</p>
                <input id="verification-code" type="text" v-model="verificationCode" class="input w-full" :placeholder="$t('auth.xbox.codePlaceholder')" />
                 <button type="button" @click="handleVerifyAndLink" class="btn btn-primary w-full mt-2" :disabled="!verificationCode || isLoading">
                     {{ $t('auth.xbox.confirmVerification') }}
                 </button>
            </div>
        </div>
      </div>
    </div>

    <!-- Change Password -->
    <div class="racing-card p-6">
       <h3 class="text-xl font-bold text-white mb-4">{{ $t('profile.settings.changePassword') }}</h3>
       <form class="space-y-4" @submit.prevent="handleChangePassword">
           <div>
            <label for="current-password" class="block text-sm font-medium text-gray-400">{{ $t('profile.settings.currentPassword') }}</label>
            <input type="password" id="current-password" v-model="passwordForm.currentPassword" class="input w-full mt-1" />
           </div>
           <div>
            <label for="new-password" class="block text-sm font-medium text-gray-400">{{ $t('profile.settings.newPassword') }}</label>
            <input type="password" id="new-password" v-model="passwordForm.newPassword" class="input w-full mt-1" />
           </div>
            <div>
            <label for="confirm-new-password" class="block text-sm font-medium text-gray-400">{{ $t('profile.settings.confirmNewPassword') }}</label>
            <input type="password" id="confirm-new-password" v-model="passwordForm.confirmNewPassword" class="input w-full mt-1" />
           </div>
           <div class="text-right pt-2">
               <button type="submit" class="btn btn-primary">{{ $t('common.save') }}</button>
           </div>
       </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { PropType } from 'vue'
import { useAuth } from '@/composables/useAuth'

const props = defineProps({
  user: {
    type: Object as PropType<any>, // Simplified for example
    required: true
  }
})

const { linkXboxID } = useAuth()

const gamertag = ref('')
const verificationCode = ref('')
const verificationSent = ref(false)
const isLoading = ref(false)

const passwordForm = ref({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
});

const sendVerification = async () => {
    isLoading.value = true
    console.log('Simulating sending verification to', gamertag.value)
    await new Promise(res => setTimeout(res, 1000))
    verificationSent.value = true
    isLoading.value = false
}

const handleVerifyAndLink = async () => {
    isLoading.value = true
    const success = await linkXboxID(gamertag.value, verificationCode.value)
    if (success) {
        alert('Xbox ID linked successfully!')
        verificationSent.value = false
        verificationCode.value = ''
        gamertag.value = ''
    } else {
        alert('Failed to link Xbox ID. Invalid code.')
    }
    isLoading.value = false
}

const unlinkXbox = () => {
    alert('Simulating unlink. In a real app, this would call an API.')
    // Here you would call an API and update the user state
}

const handleChangePassword = () => {
    if(passwordForm.value.newPassword !== passwordForm.value.confirmNewPassword) {
        alert('New passwords do not match.');
        return;
    }
    console.log('Simulating password change...')
    alert('Password changed successfully! (placeholder)')
    // Reset form
    passwordForm.value = { currentPassword: '', newPassword: '', confirmNewPassword: '' };
}

</script>
