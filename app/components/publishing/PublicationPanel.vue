<template>
  <div class="space-y-5">
    <div class="space-y-4">
      <p
        v-if="canDecide && dirty"
        class="text-sm text-muted"
      >
        {{ $t('pages.publishing.readyRequired') }}
      </p>
      <p
        v-if="failed"
        class="text-sm text-error"
      >
        {{ $t('components.requestState.failed') }}
      </p>
      <p
        v-else-if="loaded && !rows.length && !canDecide"
        class="text-sm text-muted"
      >
        {{ $t(detail.draft?.reviewStatus === 'REJECTED' ? 'pages.publishing.rejectedEmpty' : 'pages.publishing.empty') }}
      </p>
      <PublishingPublicationResult
        v-for="row in rows"
        :key="row.id"
        :publication="row"
        :busy="!!busy"
        :retrying="busy === row.id"
        :previewing="previewing === row.id"
        @preview="preview(row)"
        @cancel="action(row.id, 'cancel')"
        @retry="action(row.id, 'retry')"
      />
    </div>
    <USkeleton
      v-if="!loaded && !failed"
      class="h-48 w-full"
    />
    <template v-if="canDecide">
      <p class="text-sm text-muted">
        {{ $t('pages.publishing.description') }}
      </p>
      <PublishingPublicationForm
        :detail="detail"
        :disabled="!canPublish || !!busy"
        @created="changed"
      >
        <template #secondary="{ submitting }">
          <UButton
            color="error"
            variant="ghost"
            :disabled="submitting || !!busy || dirty || failed"
            @click="rejectOpen = true"
          >
            {{ $t('pages.publishing.reject') }}
          </UButton>
        </template>
      </PublishingPublicationForm>
    </template>
    <PublishingRejectModal
      v-if="detail.draft && detail.revision"
      v-model="rejectOpen"
      :detail="detail"
      @rejected="changed"
    />
  </div>
</template>

<script setup lang="ts">
import { publicationService } from '~/services/publishing/publication-service'
import { mediaService } from '~/services/content/media-service'
import type { Publication } from '~/types/publishing'
import type { JobDetails } from '~/types/ai-job'

const props = defineProps<{ detail: JobDetails, dirty?: boolean }>()
const emit = defineEmits<{ changed: [] }>()
const { t } = useI18n()
const handleError = useServiceError()
const toast = useToast()
const { openLightbox, closeLightbox } = useLightbox()
const rows = ref<Publication[]>([])
const loaded = ref(false)
const rejectOpen = ref(false)
const busy = ref('')
const previewing = ref('')
let previewUrl = ''
let disposed = false
const canDecide = computed(() => props.detail.draft?.reviewStatus === 'READY_FOR_REVIEW' && loaded.value && !rows.value.length)
const canPublish = computed(() => canDecide.value && !failed.value && !props.dirty && props.detail.batch.publicationPermission)
const { failed, load } = useLatestRequest(
  () => publicationService.list(props.detail.draft!.id),
  (response) => {
    rows.value = [...response.data].reverse()
    loaded.value = true
  }
)
async function changed() {
  await load()
  emit('changed')
}
async function action(id: string, operation: 'retry' | 'cancel') {
  if (busy.value) return
  busy.value = id
  try {
    await publicationService[operation](id)
    toast.add({ title: t('pages.publishing.updated'), color: 'success' })
    await changed()
  } catch (error) {
    handleError(error)
  } finally {
    busy.value = ''
  }
}
async function preview(row: Publication) {
  if (previewing.value) return
  previewing.value = row.id
  try {
    const blob = await mediaService.file(`publications/${row.id}/image`)
    if (disposed) return
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    previewUrl = URL.createObjectURL(blob)
    openLightbox(previewUrl, row.accountLabel)
  } catch (error) {
    handleError(error)
  } finally {
    previewing.value = ''
  }
}
usePolling(load, 10000)
onUnmounted(() => {
  disposed = true
  if (previewUrl) {
    closeLightbox()
    URL.revokeObjectURL(previewUrl)
  }
})
</script>
