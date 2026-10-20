<template>
  <section class="space-y-5">
    <div class="flex items-center gap-3">
      <UAvatar
        icon="i-lucide-instagram"
        size="lg"
      />
      <div class="min-w-0 flex-1 space-y-1.5">
        <p class="text-sm font-semibold text-highlighted break-words">
          {{ publication.accountLabel }}
        </p>
        <p
          v-if="publication.status === 'PUBLISHED'"
          class="text-sm text-muted"
        >
          {{ formatContentDate(publication.publishedAt, locale) }} WIB
        </p>
        <UBadge
          v-else
          :color="publicationColor(publication.status)"
          variant="subtle"
          size="sm"
        >
          {{ $t(`pages.publishing.status.${publication.status}`) }}
        </UBadge>
      </div>
      <UButton
        v-if="publication.status === 'PUBLISHED' && publication.permalink"
        :to="publication.permalink"
        target="_blank"
        rel="noopener noreferrer"
        variant="link"
        trailing-icon="i-lucide-external-link"
        class="shrink-0"
      >
        {{ $t('pages.publishing.viewPost') }}
      </UButton>
    </div>
    <dl
      v-if="publication.status !== 'PUBLISHED'"
      class="grid grid-cols-2 gap-x-6 gap-y-4 text-sm"
    >
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
    <div
      v-if="publication.status !== 'PUBLISHED'"
      class="flex flex-wrap items-center gap-2"
    >
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
