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
            <input 
              id="email-address" 
              name="email" 
              type="email" 
              autocomplete="email" 
              required 
              v-model="email" 
              class="input rounded-t-md" 
              :placeholder="$t('auth.email')"
              :disabled="isLoading"
            />
          </div>
          <div>
            <label for="password" class="sr-only">{{ $t('auth.password') }}</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              autocomplete="current-password" 
              required 
              v-model="password" 
              class="input rounded-b-md" 
              :placeholder="$t('auth.password')"
              :disabled="isLoading"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="btn btn-primary w-full"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ $t('auth.login.loading') }}
            </span>
            <span v-else>{{ $t('auth.login.submit') }}</span>
          </button>
        </div>

        <div class="text-center">
          <router-link to="/forgot-password" class="text-sm text-primary-500 hover:text-primary-400">
            {{ $t('auth.login.forgotPassword') }}
          </router-link>
        </div>

        <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuth } from '@/composables/useAuth';

const { t } = useI18n();
const router = useRouter();
const { login, isLoading, error, clearError } = useAuth();

const email = ref('test@example.com');
const password = ref('password123');

const handleLogin = async () => {
  clearError();
  
  const success = await login({
    email: email.value,
    pass: password.value,
  });

  if (success) {
    // 获取重定向路径
    const redirectPath = router.currentRoute.value.query.redirect as string;
    if (redirectPath) {
      console.log(`🔄 登录成功，重定向到: ${redirectPath}`);
      router.push(redirectPath);
    } else {
      console.log('✅ 登录成功，跳转到首页');
      router.push('/');
    }
  }
};

// 清除错误信息
onMounted(() => {
  clearError();
});
</script>
