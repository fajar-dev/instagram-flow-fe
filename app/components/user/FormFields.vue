<template>
  <div class="space-y-3">
    <UFormField
      :label="$t(`${translationPrefix}.nameLabel`)"
      name="name"
      required
    >
      <UInput
        v-model="form.name"
        :placeholder="$t(`${translationPrefix}.namePlaceholder`)"
        :disabled="disabled"
        class="w-full"
      />
    </UFormField>
    <UFormField
      :label="$t(`${translationPrefix}.emailLabel`)"
      name="email"
      required
    >
      <UInput
        v-model="form.email"
        type="email"
        :placeholder="$t(`${translationPrefix}.emailPlaceholder`)"
        :disabled="disabled"
        class="w-full"
      />
    </UFormField>
    <UFormField
      :label="$t(`${translationPrefix}.passwordLabel`)"
      name="password"
      :required="!editing"
    >
      <UInput
        v-model="form.password"
        type="password"
        :placeholder="$t(`${translationPrefix}.passwordPlaceholder`)"
        :disabled="disabled"
        class="w-full"
      />
    </UFormField>
    <UFormField
      :label="$t(`${translationPrefix}.statusLabel`)"
      name="isActive"
    >
      <div class="flex items-center gap-2">
        <USwitch
          v-model="form.isActive"
          :disabled="disabled"
        />
        <span class="text-sm text-toned">{{ form.isActive ? $t(`${translationPrefix}.active`) : $t(`${translationPrefix}.inactive`) }}</span>
      </div>
    </UFormField>
  </div>
</template>

<script setup lang="ts">
import type { UserPayload } from '~/types/user'

const form = defineModel<UserPayload>({ required: true })
defineProps<{ translationPrefix: string, editing?: boolean, disabled: boolean }>()
</script>
