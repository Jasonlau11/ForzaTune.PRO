<template>
  <div class="space-y-4">
    <!-- 可选标签 -->
    <div class="flex flex-wrap gap-2">
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        @click="toggleOption(option.value)"
        class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors"
        :class="isSelected(option.value) ? selectedClass : unselectedClass"
      >
        {{ option.label }}
      </button>
    </div>

    <!-- 已选标签 -->
    <div v-if="selectedValues.length > 0 && showSelectedTags" class="space-y-2">
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium text-gray-700">{{ selectedLabel }}:</span>
        <button
          type="button"
          @click="clearAll"
          class="text-sm text-primary-600 hover:text-primary-700"
        >
          {{ $t('common.clearAll') }}
        </button>
      </div>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="value in selectedValues"
          :key="value"
          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
        >
          {{ getOptionLabel(value) }}
          <button
            type="button"
            @click="removeOption(value)"
            class="ml-1 text-primary-600 hover:text-primary-800"
          >
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Option {
  value: string
  label: string
}

interface Props {
  modelValue: string[]
  options: Option[]
  selectedLabel?: string
  selectedClass?: string
  unselectedClass?: string
  showSelectedTags?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  selectedLabel: '已选择',
  selectedClass: 'bg-primary-600 text-white border-primary-600',
  unselectedClass: 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
  showSelectedTags: true
})

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const selectedValues = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const isSelected = (value: string) => {
  return selectedValues.value.includes(value)
}

const toggleOption = (value: string) => {
  const newValues = [...selectedValues.value]
  const index = newValues.indexOf(value)
  
  if (index > -1) {
    newValues.splice(index, 1)
  } else {
    newValues.push(value)
  }
  
  selectedValues.value = newValues
}

const removeOption = (value: string) => {
  selectedValues.value = selectedValues.value.filter(v => v !== value)
}

const clearAll = () => {
  selectedValues.value = []
}

const getOptionLabel = (value: string) => {
  const option = props.options.find(opt => opt.value === value)
  return option?.label || value
}
</script> 