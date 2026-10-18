<template>
  <UModal
    v-model:open="open"
    :title="$t('components.contact.addModal.title')"
    :description="$t('components.contact.addModal.description')"
  >
    <template #body>
      <UForm
        id="add-contact-form"
        :schema="schema"
        :state="form"
        class="space-y-3"
        @submit="handleSubmit"
      >
        <ContactFormFields v-model="form" />
      </UForm>
    </template>
    <template #footer>
      <div class="flex justify-end items-center gap-2 w-full">
        <UButton
          :label="$t('components.contact.addModal.cancel')"
          color="neutral"
          variant="soft"
          @click="() => { open = false }"
        />
        <UButton
          type="submit"
          form="add-contact-form"
          color="primary"
          :loading="isSubmitting"
        >
          {{ $t('components.contact.addModal.save') }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { contactFormSchema, createContactForm } from '~/util/contact-form'
import { contactService } from '~/services/contact-service'
import type { ContactPayload } from '~/types/contact'

const handleServiceError = useServiceError()

const open = defineModel<boolean>({ default: false })
const emit = defineEmits<{ created: [] }>()
const toast = useToast()
const isSubmitting = ref(false)

const { t } = useI18n()

const schema = computed(() => contactFormSchema(t))

const form = reactive<ContactPayload>(createContactForm())

const resetForm = () => Object.assign(form, createContactForm())

const handleSubmit = async () => {
  if (isSubmitting.value) return
  isSubmitting.value = true
  try {
    const response = await contactService.create(form)
    if (response.success) {
      toast.add({
        title: t('components.contact.addModal.createdSuccess'),
        color: 'success',
        icon: 'i-lucide-circle-check'
      })
      emit('created')
      open.value = false
      resetForm()
    }
  } catch (error) {
    handleServiceError(error)
  } finally {
    isSubmitting.value = false
  }
}

watch(open, (val) => {
  if (!val) resetForm()
})
</script>
