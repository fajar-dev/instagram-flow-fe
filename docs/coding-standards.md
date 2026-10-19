# 📏 Coding Standards

> Dokumen ini berisi aturan ketat yang WAJIB dipatuhi oleh semua AI agent dan developer.

## 1. Larangan Keras (DILARANG)

### ❌ Dilarang Menggunakan Arbitrary Values / Hardcode Class

```vue
<!-- ❌ SALAH — DILARANG KERAS -->
<div class="px-[10px]">...</div>
<div class="m-[5px]">...</div>
<div class="w-[200px]">...</div>
<div class="h-[50vh]">...</div>
<div class="text-[14px]">...</div>
<div class="gap-[12px]">...</div>
<div class="max-w-[420px]">...</div>
<div class="top-[20px]">...</div>

<!-- ✅ BENAR — Gunakan Tailwind utility standar -->
<div class="px-2.5">...</div>
<div class="m-1">...</div>
<div class="w-52">...</div>
<div class="h-screen/2">...</div>
<div class="text-sm">...</div>
<div class="gap-3">...</div>
<div class="max-w-md">...</div>
<div class="top-5">...</div>
```

### Referensi Tailwind Spacing (untuk menghindari arbitrary values)

| Arbitrary | ➡️ Gunakan | Ukuran |
|-----------|-----------|--------|
| `[2px]` | `0.5` | 2px |
| `[4px]` | `1` | 4px |
| `[5px]` | `1` (terdekat) | 4px |
| `[6px]` | `1.5` | 6px |
| `[8px]` | `2` | 8px |
| `[10px]` | `2.5` | 10px |
| `[12px]` | `3` | 12px |
| `[14px]` | `3.5` | 14px |
| `[16px]` | `4` | 16px |
| `[20px]` | `5` | 20px |
| `[24px]` | `6` | 24px |
| `[32px]` | `8` | 32px |
| `[40px]` | `10` | 40px |
| `[48px]` | `12` | 48px |

### Referensi Max Width

| Arbitrary | ➡️ Gunakan | Ukuran |
|-----------|-----------|--------|
| `[320px]` | `max-w-xs` | 320px |
| `[384px]` | `max-w-sm` | 384px |
| `[420px]` | `max-w-md` | 448px (closest) |
| `[448px]` | `max-w-md` | 448px |
| `[512px]` | `max-w-lg` | 512px |
| `[640px]` | `max-w-xl` | 576px (closest) |

### ❌ Dilarang Membuat Component Manual jika NuxtUI Sudah Menyediakan

```vue
<!-- ❌ SALAH — Jangan buat custom button -->
<button class="bg-green-500 text-white px-4 py-2 rounded">Save</button>

<!-- ✅ BENAR — Gunakan NuxtUI -->
<UButton color="primary">Save</UButton>
```

### ❌ Dilarang Menulis Logic di Template

```vue
<!-- ❌ SALAH -->
<span>{{ new Date(item.createdAt).toLocaleDateString() }}</span>

<!-- ✅ BENAR -->
<span>{{ formatDate(item.createdAt) }}</span>
```

### ❌ Dilarang Menggunakan `any` Tanpa Alasan

```typescript
// ❌ SALAH
const data: any = response.data

// ✅ BENAR
const data: User[] = response.data
```

### ❌ Dilarang Hardcode Teks UI (Wajib i18n)

```vue
<!-- ❌ SALAH -->
<UButton>Save</UButton>
<UInput placeholder="Enter name" />

<!-- ✅ BENAR -->
<UButton>{{ $t('components.user.addModal.save') }}</UButton>
<UInput :placeholder="$t('components.user.addModal.namePlaceholder')" />
```

Berlaku juga untuk toast title, pesan validasi Zod, `useHead({ title })`, header kolom `UTable`,
dan `aria-label` yang berisi kata-kata. Baca `docs/i18n-guide.md` untuk aturan lengkap.

## 2. Naming Conventions

### File Naming

| Tipe | Convention | Contoh |
|------|-----------|--------|
| Pages | `kebab-case.vue` | `forgot-password.vue` |
| Components (global) | `PascalCase.vue` | `BrandLogo.vue`, `DeleteModal.vue` |
| Components (feature) | `PascalCase.vue` di subfolder | `user/AddModal.vue` |
| Composables | `camelCase.ts` dengan prefix `use` | `useAuth.ts`, `useNavigation.ts` |
| Services | `kebab-case.ts` dengan suffix `-service` | `auth-service.ts`, `user-service.ts` |
| Types | `kebab-case.d.ts` | `auth.d.ts`, `user.d.ts` |
| Middleware | `kebab-case.ts` | `auth.global.ts`, `guest.ts` |
| i18n key | `camelCase`, nested per file (lihat `docs/i18n-guide.md`) | `components.user.addModal.nameRequired` |

### Variable & Function Naming

| Tipe | Convention | Contoh |
|------|-----------|--------|
| Variables | `camelCase` | `isLoading`, `selectedUser` |
| Functions | `camelCase` dengan prefix verb | `handleSubmit`, `fetchUsers` |
| Reactive state | `camelCase` | `const form = reactive({})` |
| Ref | `camelCase` | `const isSubmitting = ref(false)` |
| Constants | `UPPER_SNAKE_CASE` (di service) | `ACCESS_TOKEN_KEY` |
| Interface/Type | `PascalCase` | `User`, `UserPayload` |
| Emits | `past-tense` verb | `created`, `updated`, `deleted` |

### Component Naming (Auto-import oleh Nuxt)

```
app/components/BrandLogo.vue        → <BrandLogo />
app/components/DeleteModal.vue      → <DeleteModal />
app/components/user/AddModal.vue → <UserAddModal />
app/components/user/UpdateModal.vue → <UserUpdateModal />
```

## 3. Script Setup Convention

Urutan penulisan dalam `<script setup lang="ts">`:

```vue
<script setup lang="ts">
// 1. Imports
import { z } from 'zod'
import { userService } from '~/services/user-service'
import type { User, UserPayload } from '~/types/user'

// 2. Page/Component Meta
definePageMeta({ layout: 'dashboard' })

// 3. Model & Props & Emits
const open = defineModel<boolean>({ default: false })
const props = defineProps<{ user: User | null }>()
const emit = defineEmits<{ updated: [] }>()

// 4. Composables & Injections
const toast = useToast()
const route = useRoute()
const { t } = useI18n()

// 5. Reactive State
const isSubmitting = ref(false)
const form = reactive<UserPayload>({ name: '', email: '', phone: '' })

// 6. Computed Properties
const isValid = computed(() => form.name.length > 0)

// 7. Validation Schema (pesan error WAJIB via t(), lihat docs/i18n-guide.md)
const schema = z.object({
  name: z.string().min(1, t('components.user.addModal.nameRequired'))
})

// 8. Functions/Methods
const handleSubmit = async () => { /* ... */ }
const resetForm = () => { /* ... */ }

// 9. Watchers
watch(open, (val) => { /* ... */ })

// 10. Lifecycle Hooks
onMounted(() => { /* ... */ })
</script>
```

## 4. Template Convention

Urutan atribut pada element:

```vue
<UButton
  v-model="value"                    <!-- 1. v-model / v-if / v-for -->
  type="submit"                       <!-- 2. Native attributes -->
  form="add-user-form"            <!-- 3. Binding attributes -->
  color="primary"                     <!-- 4. Component props -->
  variant="outline"                   <!-- 5. Variant/style props -->
  :loading="isSubmitting"             <!-- 6. Dynamic bindings -->
  class="w-full"                      <!-- 7. Class (terakhir) -->
  @click="handleSubmit"               <!-- 8. Events -->
>
  Save
</UButton>
```

## 5. CSS Rules

### Import Order di `main.css`

```css
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap');
@import "tailwindcss";
@import "@nuxt/ui";

@theme static {
  /* Custom theme tokens */
}
```

### Class Ordering di Template

Ikuti urutan: **Layout → Sizing → Spacing → Typography → Colors → Effects → State**

```vue
<!-- Urutan class yang benar -->
<div class="flex items-center gap-3 w-full px-4 py-2 text-sm font-medium text-neutral-900 bg-white rounded-md shadow-sm transition-colors hover:bg-neutral-50">
```

## 6. Formatting Rules

| Rule | Value |
|------|-------|
| Indent | 2 spaces |
| End of line | LF |
| Trailing comma | Never (`commaDangle: 'never'`) |
| Brace style | 1TBS (`braceStyle: '1tbs'`) |
| Final newline | Yes |
| Max line length | ~120 chars (soft limit) |
| Quote style | Single quotes |

## 7. TypeScript Rules

### Type Definition Pattern

Setiap feature HARUS memiliki file type di `app/types/<feature>.d.ts`:

```typescript
// Interface untuk data dari API
export interface User {
  id: number
  name: string
  email: string
  phone: string
}

// Interface untuk payload (create/update)
export interface UserPayload {
  name: string
  email: string
  phone: string
}

// Pagination meta (reusable)
export interface PaginationMeta {
  total: number
  perPage: number
  currentPage: number
  lastPage: number
  from: number
  to: number
}

// Generic API response
export interface ApiResponse<T = any> {
  success: boolean
  statusCode?: number
  message?: string
  data: T
  meta?: PaginationMeta
}
```

### Import Types

```typescript
// Gunakan `import type` untuk type-only imports
import type { User, UserPayload } from '~/types/user'

// Bukan:
import { User } from '~/types/user'
```

## 8. Git Commit Convention

Format: `<type>(<scope>): <description>`

| Type | Keterangan |
|------|-----------|
| `feat` | Fitur baru |
| `fix` | Bug fix |
| `docs` | Dokumentasi |
| `style` | Formatting (tanpa perubahan logic) |
| `refactor` | Refactoring code |
| `chore` | Maintenance, dependencies |

Contoh:
```
feat(user): add create user modal
fix(auth): handle token refresh race condition
docs: update component guide
refactor(service): extract error handler
```

## Helper reusable frontend

- Letakkan fungsi kecil tanpa state di `app/util/`, per tanggung jawab (misalnya `date.ts`, `query.ts`, `locale.ts`), bukan satu file helper besar.
- Gunakan named export dan import eksplisit dari `~/util/...` di UI; service memakai relative import. Folder `util` tidak mengandalkan auto-import Nuxt.
- Helper menerima dependensi sebagai parameter, tanpa `useI18n`, `useToast`, ref/watch, akses sesi, atau request HTTP. State/lifecycle tetap di composable; request di service; render di komponen.
- Tanggal UI memakai `formatDate` / `formatDateTime` dengan `locale.value`; nilai kosong/tidak valid tampil `-`. Default timezone mengikuti perangkat, override `timeZone` bila konteks membutuhkannya. Timestamp numerik menggunakan milidetik.
- Query daftar memakai `buildListQuery`; filter khusus tetap ditambahkan service. Parameter route tunggal memakai `getQueryString` yang menolak array/duplikat.
- Pilihan bahasa dan ikon bendera memakai `localeOptions` / `getLocaleFlag`. Tipe bersama seperti `SortOrder` berada di `app/types`, bukan di composable.
- Tambahkan helper saat ada kebutuhan nyata dan test untuk edge case, bukan memindahkan semua event handler ke util.
