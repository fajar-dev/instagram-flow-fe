<template>
  <UModal
    v-model:open="open"
    :title="$t('components.contact.updateModal.title')"
    :description="$t('components.contact.updateModal.description')"
  >
    <template #body>
      <UForm
        id="update-contact-form"
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
          :label="$t('components.contact.updateModal.cancel')"
          color="neutral"
          variant="soft"
          @click="() => { open = false }"
        />
        <UButton
          type="submit"
          form="update-contact-form"
          color="primary"
          :loading="isSubmitting"
        >
          {{ $t('components.contact.updateModal.save') }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { contactFormSchema, createContactForm } from '~/util/contact-form'
import { contactService } from '~/services/contact-service'
import type { Contact, ContactPayload } from '~/types/contact'

const handleServiceError = useServiceError()

const open = defineModel<boolean>({ default: false })

const props = defineProps<{
  contact: Contact | null
}>()

const emit = defineEmits<{ updated: [] }>()
const toast = useToast()
const isSubmitting = ref(false)

const { t } = useI18n()

const schema = computed(() => contactFormSchema(t))

const form = reactive<ContactPayload>(createContactForm())

const populateForm = () => {
  if (props.contact) {
    form.salutation = props.contact.salutation ?? undefined
    form.name = props.contact.name
    form.email = props.contact.email
    form.phone = props.contact.phone
    form.type = props.contact.type
    form.isActive = props.contact.isActive
  }
}

const handleSubmit = async () => {
  if (isSubmitting.value) return
  if (!props.contact) return
  isSubmitting.value = true
  try {
    const response = await contactService.update(props.contact.id, form)
    if (response.success) {
      toast.add({
        title: t('components.contact.updateModal.updatedSuccess'),
        color: 'success',
        icon: 'i-lucide-circle-check'
      })
      emit('updated')
      open.value = false
    }
  } catch (error) {
    handleServiceError(error)
  } finally {
    isSubmitting.value = false
  }
}

watch(open, (val) => {
  if (val) populateForm()
})
</script>
