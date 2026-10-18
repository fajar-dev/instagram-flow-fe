<template>
  <UInputDate
    ref="inputDate"
    v-model="date"
    :disabled="disabled"
    class="w-full"
  >
    <template #trailing>
      <UPopover :reference="inputDate?.inputsRef[3]?.$el">
        <UButton
          color="neutral"
          variant="link"
          size="sm"
          icon="i-lucide-calendar"
          :aria-label="$t('components.dateInput.selectDate')"
          :disabled="disabled"
          class="px-0"
        />
        <template #content>
          <UCalendar
            v-model="date"
            :disabled="disabled"
            class="p-2"
          />
        </template>
      </UPopover>
    </template>
  </UInputDate>
</template>

<script setup lang="ts">
import { parseDate } from '@internationalized/date'
import type { DateValue } from '@internationalized/date'

const model = defineModel<string>({ default: '' })
defineProps<{ disabled?: boolean }>()
const inputDate = useTemplateRef('inputDate')
const date = computed<DateValue | undefined>({
  get: () => model.value ? parseDate(model.value) : undefined,
  set: (value) => { model.value = value?.toString() ?? '' }
})
</script>
