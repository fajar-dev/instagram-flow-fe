<template>
  <section class="space-y-5">
    <div class="flex items-center gap-3">
      <UAvatar
        icon="i-lucide-instagram"
        size="lg"
      />
      <div class="min-w-0 space-y-1.5">
        <p class="text-sm font-semibold text-highlighted break-words">
          {{ publication.accountLabel }}
        </p>
        <UBadge
          :color="publicationColor(publication.status)"
          variant="subtle"
          size="sm"
        >
          {{ $t(`pages.publishing.status.${publication.status}`) }}
        </UBadge>
      </div>
    </div>
    <dl class="grid grid-cols-2 gap-x-6 gap-y-4 rounded-lg bg-muted p-4 text-sm">
      <div class="space-y-1">
        <dt class="text-muted">
          {{ $t('pages.publishing.placement') }}
        </dt>
        <dd class="font-medium text-highlighted">
          {{ $t(`pages.contentReview.${publication.placement}`) }}
        </dd>
      </div>
      <div class="space-y-1">
        <dt class="text-muted">
          {{ $t('pages.publishing.source') }}
        </dt>
        <dd class="font-medium text-highlighted">
          {{ $t(`pages.publishing.${publication.source}`) }}
        </dd>
      </div>
      <div class="space-y-1">
        <dt class="text-muted">
          {{ $t('pages.contentReview.revision') }}
        </dt>
        <dd class="font-medium text-highlighted">
          {{ publication.revisionNo }}
        </dd>
      </div>
      <div class="space-y-1">
        <dt class="text-muted">
          {{
            $t(
              publication.publishedAt
                ? 'pages.publishing.publishedAt'
                : 'pages.publishing.scheduledAt'
            )
          }}
        </dt>
        <dd class="font-medium text-highlighted break-words">
          {{ formatContentDate(publication.publishedAt || publication.scheduledAt, locale) }} WIB
        </dd>
      </div>
    </dl>
    <p
      v-if="publication.safeError"
      class="text-sm text-error break-words"
    >
      {{ publication.safeError }}
    </p>
    <div class="flex flex-wrap items-center gap-2">
      <UButton
        v-if="publication.permalink"
        :to="publication.permalink"
        target="_blank"
        icon="i-lucide-external-link"
      >
        {{ $t('pages.publishing.viewPost') }}
      </UButton>
      <UButton
        v-if="publication.status === 'FAILED'"
        icon="i-lucide-rotate-ccw"
        :disabled="busy"
        :loading="retrying"
        @click="emit('retry')"
      >
        {{ $t('pages.publishing.retry') }}
      </UButton>
      <UButton
        variant="outline"
        color="neutral"
        icon="i-lucide-image"
        :loading="previewing"
        @click="emit('preview')"
      >
        {{ $t('pages.publishing.preview') }}
      </UButton>
      <UButton
        v-if="['QUEUED', 'SCHEDULED', 'FAILED'].includes(publication.status)"
        variant="ghost"
        color="neutral"
        :disabled="busy"
        @click="emit('cancel')"
      >
        {{ $t('pages.publishing.cancel') }}
      </UButton>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Publication } from '~/types/publishing'
import { publicationColor } from '~/util/publication'
import { formatContentDate } from '~/util/content'

defineProps<{ publication: Publication, busy: boolean, retrying: boolean, previewing: boolean }>()
const emit = defineEmits<{ preview: [], retry: [], cancel: [] }>()
const { locale } = useI18n()
</script>
