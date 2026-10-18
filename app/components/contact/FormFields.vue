<template>
  <UFormField
    :label="$t('components.contact.form.salutationLabel')"
    name="salutation"
  >
    <USelect
      v-model="form.salutation"
      :items="salutationOptions"
      :placeholder="$t('components.contact.form.salutationPlaceholder')"
      class="w-full"
    />
  </UFormField>
  <UFormField
    :label="$t('components.contact.form.nameLabel')"
    name="name"
    required
  >
    <UInput
      v-model="form.name"
      :placeholder="$t('components.contact.form.namePlaceholder')"
      class="w-full"
    />
  </UFormField>
  <UFormField
    :label="$t('components.contact.form.emailLabel')"
    name="email"
    required
  >
    <UInput
      v-model="form.email"
      type="email"
      :placeholder="$t('components.contact.form.emailPlaceholder')"
      class="w-full"
    />
  </UFormField>
  <UFormField
    :label="$t('components.contact.form.phoneLabel')"
    name="phone"
    required
  >
    <UInput
      v-model="form.phone"
      :placeholder="$t('components.contact.form.phonePlaceholder')"
      class="w-full"
    />
  </UFormField>
  <UFormField
    :label="$t('components.contact.form.typeLabel')"
    name="type"
    required
  >
    <USelect
      v-model="form.type"
      :placeholder="$t('components.contact.form.typePlaceholder')"
      :items="typeOptions"
      class="w-full"
    />
  </UFormField>
  <UFormField
    :label="$t('components.contact.form.statusLabel')"
    name="isActive"
  >
    <div class="flex items-center gap-2">
      <USwitch v-model="form.isActive" />
      <span class="text-sm text-toned">{{ form.isActive ? $t('components.contact.form.active') : $t('components.contact.form.inactive') }}</span>
    </div>
  </UFormField>
</template>

<script setup lang="ts">
import type { ContactPayload } from '~/types/contact'

const form = defineModel<ContactPayload>({ required: true })
const { t } = useI18n()

const salutationOptions = computed(() => [
  { label: t('components.contact.form.salutationMr'), value: 'mr' },
  { label: t('components.contact.form.salutationMrs'), value: 'mrs' }
])

const typeOptions = computed(() => [
  { label: t('components.contact.form.typeCustomer'), value: 'customer' },
  { label: t('components.contact.form.typeVendor'), value: 'vendor' },
  { label: t('components.contact.form.typeSupplier'), value: 'supplier' },
  { label: t('components.contact.form.typeOther'), value: 'other' }
])
</script>
