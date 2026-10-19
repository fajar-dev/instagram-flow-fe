# API client frontend IG Flow

`app/services/api-service.ts` menyediakan satu Axios client. Plugin client mengatur API base URL, callback bahasa, refresh token, session expiry dan inisialisasi auth. Service fitur tidak memanggil composable Nuxt dari constructor atau membuat client sendiri.

## Kontrak

Service JSON fitur mengembalikan `ApiResponse<T>` dari response.data Axios. UI membaca `.data` untuk payload dan `.meta` untuk pagination. Download/media binary mengembalikan Blob. Auth mempertahankan kontrak sesi dan refresh tersendiri.

Referensi CRUD: `app/services/user-service.ts`. Client konten berada di folder content, ai-job, content-review, integration dan reporting. Tipe envelope ada di `app/types/api.d.ts`. Jangan membuat facade social atau tipe response lain yang identik.

`app/services/shared/request-headers.ts` membaca token terbaru setiap request dan menambahkan Idempotency-Key jika diberikan. `app/util/query.ts` membangun query list. Jangan menyimpan snapshot token di constructor atau menulis ulang escaping/query di setiap halaman.

## Error dan concurrency

Biarkan rejection Axios tetap utuh. Service tidak menampilkan toast, menavigasi, atau mengubah kegagalan menjadi undefined. UI mengambil useServiceError saat setup, lalu mengatur loading/error dengan try/catch/finally.

Pertahankan koordinasi refresh token pada api-service dan jangan menghapus sesi karena kegagalan jaringan biasa. Request list memakai useLatestRequest; editor mengirim expectedRevisionId atau revisionId/contentHash agar edit/review yang terlambat ditolak backend.

Signed URL dan Blob adalah akses sementara. Jangan menyimpan URL presigned sebagai identitas permanen aset atau memodifikasi host/query signature. Object key dan asset ID tetap dikelola backend.
