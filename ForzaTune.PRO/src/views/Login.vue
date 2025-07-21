<template>
  <div class="min-h-screen bg-dark-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-white">
          {{ $t('auth.login.title') }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-400">
          {{ $t('common.or') }}
          <router-link to="/register" class="font-medium text-primary-500 hover:text-primary-400">
            {{ $t('auth.login.registerLink') }}
          </router-link>
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email-address" class="sr-only">{{ $t('auth.email') }}</label>
            <input id="email-address" name="email" type="email" autocomplete="email" required v-model="email" class="input rounded-t-md" :placeholder="$t('auth.email')" />
          </div>
          <div>
            <label for="password" class="sr-only">{{ $t('auth.password') }}</label>
            <input id="password" name="password" type="password" autocomplete="current-password" required v-model="password" class="input rounded-b-md" :placeholder="$t('auth.password')" />
          </div>
        </div>

        <div>
          <button type="submit" class="btn btn-primary w-full" :disabled="isLoading">
             {{ $t('auth.login.submit') }}
          </button>
        </div>
         <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuth } from '@/composables/useAuth';

const { t } = useI18n();
const router = useRouter();
const { login } = useAuth();

const email = ref('test@example.com');
const password = ref('password123');
const isLoading = ref(false);
const error = ref<string | null>(null);

const handleLogin = async () => {
  isLoading.value = true;
  error.value = null;

  const success = await login({
    email: email.value,
    pass: password.value,
  });

  isLoading.value = false;

  if (success) {
    const redirectPath = router.currentRoute.value.query.redirect as string || '/';
    router.push(redirectPath);
  } else {
    error.value = t('auth.errors.loginFailed');
  }
};
</script>
