# Konvensi frontend IG Flow

## Tanggung jawab

Page menyusun layout dan component. Composable mengelola state/lifecycle. Service menangani HTTP. Helper tanpa state berada di `app/util/`. Jangan menyalin formatter, pagination query, auth header atau penanganan error ke setiap halaman.

Referensi aktif: `app/pages/user/index.vue`, `app/pages/profile/information.vue`, `app/services/user-service.ts`, `app/components/user/FormFields.vue`. Contact telah dihapus dan tidak menjadi acuan.

## TypeScript dan Vue

Gunakan script setup TypeScript, indent dua spasi, single quote dan tanpa trailing comma sesuai ESLint. Gunakan import type untuk tipe. Nama komponen PascalCase, service/file route kebab-case dan composable camelCase berawalan use. Urutan script: import, macro/meta, composable, state, computed/schema, fungsi, watcher dan lifecycle.

Ambil composable yang memerlukan konteks Nuxt saat setup, sebelum await. Jangan memanggil useRuntimeConfig/useToast/useI18n dari constructor service singleton. Plugin API menjadi composition root HTTP/auth. Tangani error tanpa membuang detail Axios, dan pulihkan loading melalui finally.

## Konsistensi UI

Gunakan Nuxt UI dan token Tailwind yang sudah tersedia. Tidak memakai arbitrary value, CSS hardcoded untuk meniru komponen, atau library baru bila komponen saat ini cukup. Pertahankan tema primary, ukuran heading/body dan spacing dari User/Profile. Input wajib mempunyai label, placeholder yang relevan, dan required pada UFormField bila validator mensyaratkannya.

Semua teks UI, termasuk aria-label dan validation message, memakai i18n en/id. Gunakan toast untuk hasil aksi; pesan inline tetap sesuai untuk field invalid, halaman gagal dimuat, dan status job yang perlu terlihat terus. Jangan menambah tombol refresh manual atau selector role.

## Domain dan media

Gunakan DateInput untuk tanggal kalender; `formatDate`/`formatDateTime` untuk format umum dan `formatContentDate` untuk waktu workflow Asia/Jakarta. Jangan mengubah tanggal dokumentasi menjadi timestamp secara sembarang.

Gunakan shared lightbox untuk gambar selain avatar. Avatar memakai UAvatar. Revoke Blob URL dan hentikan observer/polling saat lifecycle berakhir. Media persisten berada di MinIO; jangan membuat folder upload lokal atau menyimpan data URL sebagai media database.

## Verifikasi

Jalankan typecheck, lint, test dan build untuk perubahan implementasi. Periksa browser desktop/mobile bila tersedia, terutama overflow, fokus keyboard, carousel, empty/error states dan transisi halaman. Laporkan jika pemeriksaan visual tidak dapat dilakukan. Perubahan dokumentasi diverifikasi terhadap source dan link tanpa menambah test salinan teks.
