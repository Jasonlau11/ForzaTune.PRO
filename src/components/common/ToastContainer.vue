<template>
  <div class="fixed top-4 right-4 z-50 space-y-4">
    <TransitionGroup name="toast">
      <component
        v-for="toast in toasts"
        :key="toast.id"
        :is="toast.component"
        v-bind="toast.props"
      />
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const { toasts } = useToast()
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-enter-to,
.toast-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style> 