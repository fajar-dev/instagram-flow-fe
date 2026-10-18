<template>
  <div class="space-y-6">
    <!-- Header -->
    <Header
      :title="$t('pages.contact.title')"
      :description="$t('pages.contact.description')"
    />

    <DataTable
      v-model:search="search"
      v-model:page="page"
      v-model:per-page="perPage"
      :data="data"
      :columns="columns"
      :loading="isLoading"
      :total="meta.total"
      :from="meta.from"
      :to="meta.to"
      :search-placeholder="$t('pages.contact.searchPlaceholder')"
      table-class="min-w-192"
    >
      <template #actions>
        <UButton
          color="primary"
          variant="solid"
          icon="i-lucide-plus-circle"
          class="w-full sm:w-auto justify-center"
          @click="() => { showAddModal = true }"
        >
          {{ $t('pages.contact.addContact') }}
        </UButton>
      </template>
    </DataTable>

    <!-- Modals -->
    <ContactAddModal
      v-model="showAddModal"
      @created="fetchContacts"
    />
    <ContactUpdateModal
      v-model="showUpdateModal"
      :contact="selectedContact"
      @updated="fetchContacts"
    />
    <DeleteModal
      v-model="showDeleteModal"
      :title="$t('pages.contact.deleteTitle')"
      :item-name="selectedContact?.name"
      :loading="isDeleting"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { formatDateTime } from '~/util/date'
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Row } from '@tanstack/vue-table'
import { contactService } from '~/services/contact-service'
import type { Contact } from '~/types/contact'

const handleServiceError = useServiceError()

definePageMeta({
  layout: 'dashboard'
})

const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UBadge = resolveComponent('UBadge')
const { t, locale } = useI18n()

const typeLabels: Record<string, string> = {
  customer: 'typeCustomer',
  vendor: 'typeVendor',
  supplier: 'typeSupplier',
  other: 'typeOther'
}

// State
const data = ref<Contact[]>([])
const selectedContact = ref<Contact | null>(null)

// Modal states
const showAddModal = ref(false)
const showUpdateModal = ref(false)
const showDeleteModal = ref(false)
const isDeleting = ref(false)

// Pagination meta
const meta = reactive({
  total: 0,
  from: 0,
  to: 0
})

// Fetch contacts from API
const { loading: isLoading, load: fetchContacts } = useLatestRequest(
  () => contactService.getAll(page.value, perPage.value, search.value, sortBy.value, order.value),
  (response) => {
    data.value = response.data
    meta.total = response.meta?.total ?? 0
    meta.from = response.meta?.from ?? 0
    meta.to = response.meta?.to ?? 0
    const lastPage = Math.max(1, Math.ceil(meta.total / perPage.value))
    if (page.value > lastPage) page.value = lastPage
  }
)

const { search, perPage, page, sortBy, order, sortHeader } = useTableQuery(fetchContacts)

// Table columns
const columns: TableColumn<Contact>[] = [
  {
    accessorKey: 'id',
    header: () => t('pages.contact.columnId'),
    cell: ({ row }) => `#${row.getValue('id')}`
  },
  {
    accessorKey: 'name',
    header: sortHeader(() => t('pages.contact.columnName'), 'name')
  },
  {
    accessorKey: 'email',
    header: sortHeader(() => t('pages.contact.columnEmail'), 'email')
  },
  {
    accessorKey: 'phone',
    header: sortHeader(() => t('pages.contact.columnPhone'), 'phone')
  },
  {
    accessorKey: 'type',
    header: sortHeader(() => t('pages.contact.columnType'), 'type'),
    cell: ({ row }) => t(`pages.contact.${typeLabels[row.original.type]}`)
  },
  {
    accessorKey: 'isActive',
    header: sortHeader(() => t('pages.contact.columnStatus'), 'isActive'),
    cell: ({ row }) => {
      const isActive = row.original.isActive
      return h(
        UBadge,
        {
          color: isActive ? 'primary' : 'error',
          variant: 'subtle'
        },
        () => (isActive ? t('pages.contact.active') : t('pages.contact.inactive'))
      )
    }
  },
  {
    accessorKey: 'createdAt',
    header: sortHeader(() => t('pages.contact.columnCreatedAt'), 'createdAt'),
    cell: ({ row }) => formatDateTime(row.original.createdAt, locale.value)
  },
  {
    id: 'actions',
    header: () => t('pages.contact.columnAction'),
    meta: {
      class: {
        td: 'text-right',
        th: 'text-right'
      }
    },
    cell: ({ row }) => {
      return h(
        UDropdownMenu,
        {
          'content': {
            align: 'end'
          },
          'items': getRowItems(row),
          'aria-label': t('pages.contact.actionsDropdown')
        },
        () =>
          h(UButton, {
            'icon': 'i-lucide-ellipsis-vertical',
            'color': 'neutral',
            'variant': 'ghost',
            'aria-label': t('pages.contact.actionsDropdown')
          })
      )
    }
  }
]

function getRowItems(row: Row<Contact>) {
  return [
    {
      label: t('pages.contact.editContact'),
      icon: 'i-lucide-edit',
      onSelect() {
        selectedContact.value = row.original
        showUpdateModal.value = true
      }
    },
    {
      label: t('pages.contact.deleteContact'),
      color: 'error',
      icon: 'i-lucide-trash',
      onSelect() {
        selectedContact.value = row.original
        showDeleteModal.value = true
      }
    }
  ]
}

// Handle delete
const toast = useToast()
const handleDelete = async () => {
  if (!selectedContact.value || isDeleting.value) return
  isDeleting.value = true
  try {
    const response = await contactService.delete(selectedContact.value.id)
    if (response.success) {
      toast.add({
        title: t('pages.contact.deletedSuccess'),
        color: 'success',
        icon: 'i-lucide-circle-check'
      })
    }
    showDeleteModal.value = false
    fetchContacts()
  } catch (error) {
    handleServiceError(error)
  } finally {
    isDeleting.value = false
  }
}

// Initial fetch
onMounted(() => {
  fetchContacts()
})
</script>
