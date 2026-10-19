# Produk dan struktur frontend IG Flow

IG Flow membantu tim AMTI mengolah dokumentasi kegiatan menjadi caption serta preview feed/story untuk review internal. Analisis AI dijalankan n8n melalui backend; browser tidak memanggil provider AI atau menyimpan credential integrasi.

## Peta halaman

| Route | Fungsi |
| --- | --- |
| `/` | Mengarahkan ke overview |
| `/auth/sign-in` | Login email/password dan Google |
| `/auth/forgot-password` | Request/resend email reset |
| `/auth/reset-password` | Validasi token dan penggantian password |
| `/overview` | Ringkasan job/konten |
| `/content` | List terpadu berdasarkan status, beserta count per tab |
| `/content/upload` | Metadata batch, validasi dan upload per file, proses AI |
| `/content/:jobId` | Carousel foto, status/error, metadata dan timeline |
| `/content/:jobId/edit` | Preview, Caption, Photos, Review dan History |
| `/content/media` | Library foto, filter, download, archive dan infinite scroll |
| `/activity-logs` | Jejak aktivitas aplikasi |
| `/integration-settings` | Sakelar dispatcher dan kesiapan konfigurasi |
| `/user` | Pengelolaan akun |
| `/profile/information` | Nama, email dan avatar pengguna |
| `/profile/password` | Penggantian password |

`/profile` memakai halaman induk untuk tab profil. Alias kompatibilitas masih terdaftar untuk `/ai-jobs`, `/content-review`, `/content-review/studio`, serta detail/editor lama. Navigasi utama selalu memakai `/content`; alias bukan modul atau menu terpisah. Tidak ada route Contact atau prefix social aktif.

## Status dan alur

Tab list berasal dari `app/util/content-tabs.ts`. QUEUED, DISPATCHED, PROCESSING dan FAILED membaca resource jobs; READY_FOR_REVIEW, IN_REVIEW, REVISION_REQUESTED, APPROVED_INTERNAL dan REJECTED membaca resource review. Filter default adalah READY_FOR_REVIEW.

Editor menyimpan revision terlebih dahulu sebelum review. Review menggunakan revision ID dan content hash; perubahan setelah approval membuat preview lama outdated. History menampilkan keputusan dan catatan review, bukan diff seluruh perubahan caption. Belum ada publishing/scheduling Instagram atau Telegram.

## Struktur

- `app/pages/`: route dan susunan halaman.
- `app/components/`: komponen bersama serta folder fitur content, content-review, reporting dan user.
- `app/composables/`: state, lifecycle, polling, request terbaru, upload, editor dan reporting.
- `app/services/`: API client/auth/user dan client per fitur; tanpa toast atau navigasi.
- `app/types/`: kontrak response dan domain.
- `app/util/`: helper stateless tanggal, query, upload, format konten, locale dan navigasi.
- `i18n/locales/`: seluruh teks UI en/id.

Semua pengguna aktif mempunyai navigasi dan akses yang sama. JWT tetap diperlukan. Gambar persisten berasal dari MinIO melalui API/presigned URL; Blob browser hanya untuk preview sementara. Logo/icon statis merupakan aset build.
