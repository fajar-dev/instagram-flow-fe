# Service layer

Acuan: `app/services/contact-service.ts`, `user-service.ts`, dan `auth-service.ts`.

## Kontrak HTTP

Service hanya melakukan request melalui singleton apiService. Semua operasi JSON fitur mengembalikan `Promise<ApiResponse<T>>` dari `response.data`, termasuk mutation. UI membaca `response.data` untuk payload dan `response.meta` untuk pagination. File download mengembalikan Blob. Auth mempertahankan kontrak khusus pengelolaan session dan refresh yang sudah ada.

```typescript
import { apiService } from '../api-service'
import { requestHeaders } from '../shared/request-headers'
import type { ApiResponse } from '~/types/api'
import type { Batch } from '~/types/content'

async function getById(id: string): Promise<ApiResponse<Batch>> {
  const response = await apiService.client.get<ApiResponse<Batch>>(
    `/batches/${encodeURIComponent(id)}`,
    { headers: requestHeaders() }
  )
  return response.data
}
```

`requestHeaders(key?)` membaca token terbaru saat request dan menambahkan Idempotency-Key bila diberikan. Jangan menyimpan token pada constructor atau menduplikasi header di setiap service. Gunakan buildListQuery dari app/util/query untuk parameter list CRUD.

## Error dan lifecycle

Biarkan rejection Axios diteruskan utuh. Service tidak memakai toast, navigateTo, useI18n, useRuntimeConfig, atau catch yang mengganti error menjadi undefined. Plugin Nuxt mengonfigurasi HTTP/auth. UI memanggil useServiceError saat setup, lalu menangani error dan loading dalam try/catch/finally.

## Pembagian fitur

Client contact/user/auth berada pada root mengikuti codebase awal. Content, ai-job, content-review, integration, dan reporting memiliki folder fitur. Child upload/download berada dalam content. Tipe ada di app/types, helper stateless di app/util, state Vue di composable, dan render di component/page. Tidak ada facade social-service kedua.

Lihat [audit terbaru](audit-2026-10-16.md) untuk kompatibilitas URL dan batas verifikasi.
