<template>
  <section class="space-y-3">
    <p class="text-sm text-muted">
      {{ $t('pages.publishing.orderHint', { count: model.length, limit }) }}
    </p>
    <div class="space-y-3">
      <div
        v-for="slide in ordered"
        :key="slide.id"
        :data-slide-id="slide.id"
        class="flex gap-4 rounded-lg border p-3 transition-colors"
        :class="model.includes(slide.id) ? 'border-primary bg-primary/5' : 'border-default'"
      >
        <div class="w-24 sm:w-28 shrink-0">
          <ContentPrivateImage
            :path="`renders/${slide.id}`"
            :alt="$t('pages.publishing.slide')"
            :placement="slide.placement"
          />
        </div>
        <div class="min-w-0 flex-1 space-y-3">
          <UBadge
            v-if="rankingsByAsset[slide.assetId]"
            color="neutral"
            variant="soft"
          >
            {{ rankingsByAsset[slide.assetId]?.score }}/100
          </UBadge>
          <p
            v-if="rankingsByAsset[slide.assetId]?.reason"
            class="text-sm text-muted break-words"
          >
            {{ rankingsByAsset[slide.assetId]?.reason }}
          </p>
          <div class="flex flex-wrap items-center justify-between gap-2">
            <UCheckbox
              :model-value="model.includes(slide.id)"
              :disabled="disabled || (!model.includes(slide.id) && model.length >= limit)"
              :label="
                model.includes(slide.id)
                  ? $t('pages.publishing.slidePosition', { position: model.indexOf(slide.id) + 1 })
                  : $t('pages.publishing.selectSlide')
              "
              @update:model-value="toggle(slide.id)"
            />
            <UButton
              v-if="model.includes(slide.id) && limit > 1"
              icon="i-lucide-grip-vertical"
              variant="ghost"
              size="sm"
              class="touch-none cursor-grab"
              :disabled="disabled"
              :aria-label="$t('pages.publishing.dragSlide')"
              @pointerdown="start($event, slide.id)"
              @pointermove="move"
              @pointerup="dragging = ''"
              @pointercancel="dragging = ''"
            />
          </div>
          <div
            v-if="model.includes(slide.id) && limit > 1"
            class="flex items-center gap-1"
          >
            <UButton
              icon="i-lucide-arrow-up"
              size="xs"
              variant="ghost"
              :disabled="disabled || model.indexOf(slide.id) === 0"
              :aria-label="$t('pages.publishing.moveEarlier')"
              @click="shift(slide.id, -1)"
            />
            <UButton
              icon="i-lucide-arrow-down"
              size="xs"
              variant="ghost"
              :disabled="disabled || model.indexOf(slide.id) === model.length - 1"
              :aria-label="$t('pages.publishing.moveLater')"
              @click="shift(slide.id, 1)"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { AiResult, Render } from '~/types/ai-job'
import { moveSlide } from '~/util/slides'

const model = defineModel<string[]>({ required: true })
const props = defineProps<{
  renders: Render[]
  rankings: AiResult['rankings']
  limit: number
  disabled?: boolean
}>()
const dragging = ref('')
const rankingsByAsset = computed(() =>
  Object.fromEntries(props.rankings.map(item => [item.assetId, item]))
)
const ordered = computed(() => [
  ...model.value
    .map(id => props.renders.find(r => r.id === id))
    .filter((r): r is Render => !!r),
  ...props.renders.filter(r => !model.value.includes(r.id))
])

function toggle(id: string) {
  if (props.disabled) {
    return
  }
  if (model.value.includes(id)) {
    model.value = model.value.filter(value => value !== id)
  } else if (model.value.length < props.limit) {
    model.value = [...model.value, id]
  }
}

function shift(id: string, offset: number) {
  model.value = moveSlide(model.value, id, model.value.indexOf(id) + offset)
}

function start(event: PointerEvent, id: string) {
  if (props.disabled) {
    return
  }
  dragging.value = id
  ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
}

function move(event: PointerEvent) {
  if (!dragging.value || props.disabled) {
    return
  }
  const target = document
    .elementFromPoint(event.clientX, event.clientY)
    ?.closest<HTMLElement>('[data-slide-id]')?.dataset.slideId
  if (target && model.value.includes(target)) {
    model.value = moveSlide(model.value, dragging.value, model.value.indexOf(target))
  }
}
</script>
