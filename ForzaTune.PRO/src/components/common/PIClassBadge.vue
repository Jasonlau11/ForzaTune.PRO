<template>
  <span
    class="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
    :class="badgeClass"
  >
    {{ displayText }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PIClass } from '@/types'
import { getPIClassStyle, getPIClass } from '@/utils/piClass'

interface Props {
  piClass?: PIClass
  pi?: number
  showPIValue?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showPIValue: false
})

const effectivePIClass = computed(() => {
  if (props.piClass) {
    return props.piClass
  }
  if (props.pi) {
    return getPIClass(props.pi)
  }
  return 'D'
})

const badgeClass = computed(() => {
  return getPIClassStyle(effectivePIClass.value)
})

const displayText = computed(() => {
  if (props.showPIValue && props.pi) {
    return `${effectivePIClass.value}-${props.pi}`
  }
  return effectivePIClass.value
})
</script> 