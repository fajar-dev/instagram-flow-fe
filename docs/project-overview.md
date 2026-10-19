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
| `/content/:jobId/edit` | Preview, Caption, Photos dan Publish |
| `/content/media` | Library foto, filter, download, archive dan infinite scroll |
| `/activity-logs` | Jejak aktivitas aplikasi |
| `/settings` | Akun Instagram dan sakelar dispatcher AI |
| `/user` | Pengelolaan akun |
| `/profile/information` | Nama, email dan avatar pengguna |
| `/profile/password` | Penggantian password |

`/integration-settings` tetap alias kompatibilitas ke Settings. `/profile` memakai halaman induk untuk tab profil. Alias kompatibilitas masih terdaftar untuk `/ai-jobs`, `/content-review`, `/content-review/studio`, serta detail/editor lama. Navigasi utama selalu memakai `/content`; alias bukan modul atau menu terpisah. Tidak ada route Contact atau prefix social aktif.

## Status dan alur

Tab list berasal dari `app/util/content-tabs.ts`. QUEUED, DISPATCHED, PROCESSING dan FAILED membaca resource jobs; READY_FOR_REVIEW, PUBLISH dan REJECTED membaca resource review. Filter default adalah READY_FOR_REVIEW.

Editor menyimpan revision terlebih dahulu sebelum Publish atau Reject. Reject menggunakan revision ID dan content hash. Setelah keputusan, editor terkunci. Catatan penolakan tampil di Summary detail dan editor; data keputusan tetap tersimpan untuk audit tanpa tab History. Publikasi feed/story langsung atau terjadwal berada pada tab Publish di Content editor; Telegram belum tersedia.

## Struktur

- `app/pages/`: route dan susunan halaman.
- `app/components/`: komponen bersama serta folder fitur content, content-review, reporting dan user.
- `app/composables/`: state, lifecycle, polling, request terbaru, upload, editor dan reporting.
- `app/services/`: API client/auth/user dan client per fitur; tanpa toast atau navigasi.
- `app/types/`: kontrak response dan domain.
- `app/util/`: helper stateless tanggal, query, upload, format konten, locale dan navigasi.
- `i18n/locales/`: seluruh teks UI en/id.

Semua pengguna aktif mempunyai navigasi dan akses yang sama. JWT tetap diperlukan. Gambar persisten berasal dari MinIO melalui API/presigned URL; Blob browser hanya untuk preview sementara. Logo/icon statis merupakan aset build.

## Publikasi

Panel Instagram publishing hanya tersedia di Content editor setelah ada draft. Halaman detail menyediakan ringkasan dan tautan menuju editor. Publikasi memerlukan revisi tersimpan READY_FOR_REVIEW dan consent batch. Pilih akun dari JSON server, foto/desain, feed/story, post sekarang atau jadwal WIB. Desain lama tidak dapat dipilih setelah edit revisi. Project yang sudah masuk publikasi tidak dapat diedit atau dipublikasikan lagi. Retry memakai record yang sama; pembatalan mengakhiri project sebagai REJECTED. Worker backend harus aktif.
