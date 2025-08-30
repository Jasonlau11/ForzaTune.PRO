<template>
  <div class="min-h-screen bg-dark-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- 步骤1: 输入邮箱 -->
      <div v-if="step === 1">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-white">
            {{ $t('auth.forgotPassword.title') }}
          </h2>
          <p class="mt-2 text-center text-sm text-gray-400">
            {{ $t('auth.forgotPassword.subtitle') }}
          </p>
        </div>
        <form class="mt-8 space-y-6" @submit.prevent="sendResetCode">
          <div>
            <label for="email-address" class="sr-only">{{ $t('auth.forgotPassword.emailLabel') }}</label>
            <input
              id="email-address"
              name="email"
              type="email"
              autocomplete="email"
              required
              v-model="email"
              class="input"
              :placeholder="$t('auth.forgotPassword.emailPlaceholder')"
              :disabled="isLoading"
            />
          </div>

          <div>
            <button
              type="submit"
              class="btn btn-primary w-full"
              :disabled="isLoading || !email"
            >
              <span v-if="isLoading" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ $t('auth.forgotPassword.sending') }}
              </span>
              <span v-else>{{ $t('auth.forgotPassword.sendCode') }}</span>
            </button>
          </div>
        </form>
      </div>

      <!-- 步骤2: 验证验证码 -->
      <div v-if="step === 2">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-white">
            {{ $t('auth.forgotPassword.verifyCode') }}
          </h2>
          <p class="mt-2 text-center text-sm text-gray-400">
            {{ $t('auth.forgotPassword.codeSent') }}
            <span v-if="email" class="block mt-1 text-xs">{{ $t('auth.forgotPassword.codeSentTo') }} {{ email }}</span>
          </p>
        </div>
        <form class="mt-8 space-y-6" @submit.prevent="verifyCode">
          <div>
            <label for="verification-code" class="sr-only">{{ $t('auth.forgotPassword.codeLabel') }}</label>
            <input
              id="verification-code"
              name="code"
              type="text"
              autocomplete="one-time-code"
              required
              v-model="verificationCode"
              class="input"
              :placeholder="$t('auth.forgotPassword.codePlaceholder')"
              :disabled="isLoading"
              maxlength="6"
            />
          </div>

          <div>
            <button
              type="submit"
              class="btn btn-primary w-full"
              :disabled="isLoading || !verificationCode"
            >
              <span v-if="isLoading" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ $t('auth.forgotPassword.verifying') }}
              </span>
              <span v-else>{{ $t('auth.forgotPassword.verify') }}</span>
            </button>
          </div>

          <!-- 重新发送验证码 -->
          <div class="text-center">
            <button
              type="button"
              @click="resendCode"
              :disabled="isResending || countdown > 0"
              class="text-sm text-primary-500 hover:text-primary-400 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              <span v-if="isResending">{{ $t('auth.forgotPassword.resending') }}</span>
              <span v-else-if="countdown > 0">{{ $t('auth.forgotPassword.resendIn', { seconds: countdown }) }}</span>
              <span v-else>{{ $t('auth.forgotPassword.resendCode') }}</span>
            </button>
          </div>
        </form>
      </div>

      <!-- 步骤3: 重置密码 -->
      <div v-if="step === 3">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-white">
            {{ $t('auth.forgotPassword.resetPassword') }}
          </h2>
        </div>
        <form class="mt-8 space-y-6" @submit.prevent="resetPassword">
          <div class="space-y-4">
            <div>
              <label for="new-password" class="sr-only">{{ $t('auth.forgotPassword.newPasswordLabel') }}</label>
              <input
                id="new-password"
                name="newPassword"
                type="password"
                autocomplete="new-password"
                required
                v-model="newPassword"
                class="input"
                :placeholder="$t('auth.forgotPassword.newPasswordPlaceholder')"
                :disabled="isLoading"
              />
            </div>
            <div>
              <label for="confirm-password" class="sr-only">{{ $t('auth.forgotPassword.confirmPasswordLabel') }}</label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                autocomplete="new-password"
                required
                v-model="confirmPassword"
                class="input"
                :placeholder="$t('auth.forgotPassword.confirmPasswordPlaceholder')"
                :disabled="isLoading"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              class="btn btn-primary w-full"
              :disabled="isLoading || !newPassword || !confirmPassword"
            >
              <span v-if="isLoading" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ $t('auth.forgotPassword.resetting') }}
              </span>
              <span v-else>{{ $t('auth.forgotPassword.reset') }}</span>
            </button>
          </div>
        </form>
      </div>

      <!-- 成功页面 -->
      <div v-if="step === 4" class="text-center">
        <div class="bg-green-100 dark:bg-green-900 rounded-lg p-6">
          <svg class="mx-auto h-12 w-12 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="mt-2 text-lg font-medium text-green-800 dark:text-green-200">
            {{ $t('auth.forgotPassword.success') }}
          </h3>
          <p class="mt-1 text-sm text-green-700 dark:text-green-300">
            {{ $t('auth.forgotPassword.successMessage') }}
          </p>
        </div>

        <div class="mt-6">
          <router-link to="/login" class="btn btn-primary">
            {{ $t('auth.forgotPassword.backToLogin') }}
          </router-link>
        </div>
      </div>

      <!-- 返回按钮 -->
      <div v-if="step < 4" class="text-center">
        <router-link to="/login" class="text-sm text-gray-400 hover:text-gray-300">
          {{ $t('auth.forgotPassword.backToLogin') }}
        </router-link>
      </div>

      <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuth } from '@/composables/useAuth';

const { t } = useI18n();
const router = useRouter();
const { forgotPassword, verifyResetCode, resetPassword: authResetPassword, isLoading, error, clearError } = useAuth();

const step = ref(1);
const email = ref('');
const verificationCode = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const resetToken = ref('');

// 重新发送相关状态
const isResending = ref(false);
const countdown = ref(0);
let countdownTimer: NodeJS.Timeout | null = null;

// 启动倒计时
const startCountdown = (seconds: number = 60) => {
  countdown.value = seconds;
  if (countdownTimer) {
    clearInterval(countdownTimer);
  }
  countdownTimer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      if (countdownTimer) {
        clearInterval(countdownTimer);
        countdownTimer = null;
      }
    }
  }, 1000);
};

// 发送重置验证码
const sendResetCode = async () => {
  clearError();

  try {
    const success = await forgotPassword(email.value);
    if (success) {
      step.value = 2;
      startCountdown(); // 启动倒计时
    }
  } catch (err) {
    // 错误已在composable中处理
  }
};

// 重新发送验证码
const resendCode = async () => {
  clearError();
  isResending.value = true;

  try {
    const success = await forgotPassword(email.value);
    if (success) {
      startCountdown(); // 重新启动倒计时
    }
  } catch (err) {
    // 错误已在composable中处理
  } finally {
    isResending.value = false;
  }
};

// 验证验证码
const verifyCode = async () => {
  clearError();

  try {
    const result = await verifyResetCode(email.value, verificationCode.value);
    if (result && result.token) {
      resetToken.value = result.token;
      step.value = 3;
    }
  } catch (err) {
    // 错误已在composable中处理
  }
};

// 重置密码
const resetPassword = async () => {
  clearError();

  try {
    const success = await authResetPassword(resetToken.value, newPassword.value, confirmPassword.value);
    if (success) {
      step.value = 4;
    }
  } catch (err) {
    // 错误已在composable中处理
  }
};

// 清除错误信息和定时器
onMounted(() => {
  clearError();
});

// 组件卸载时清理定时器
onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
});
</script>
