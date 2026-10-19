# Bahasa frontend IG Flow

Seluruh teks yang terlihat pengguna berasal dari `i18n/locales/id.json` dan `en.json`. Locale default Indonesia, URL tidak memakai prefix bahasa. Nuxt i18n menyimpan preferensi melalui cookie sesuai `nuxt.config.ts`. API client mengirim bahasa aktif melalui Accept-Language.

## Menambah teks

Gunakan namespace fitur yang sudah ada, misalnya pages.content, pages.contentReview atau components.user. Tambahkan key pada kedua locale dengan struktur yang sama. Template memakai `$t`, script setup memakai `const { t } = useI18n()`.

Label, placeholder, toast, empty/error state, validation message dan aria-label harus diterjemahkan. Status domain/API seperti APPROVED_INTERNAL tetap stabil; label tampilan diterjemahkan. Jangan menerjemahkan key JSON atau nilai enum backend.

Computed tabs/navigation harus bergantung pada locale agar berubah tanpa reload. Jangan menyimpan hasil terjemahan sekali pada constructor service. Service meneruskan error; UI menerjemahkan fallback melalui useServiceError.

## Tanggal dan format

Gunakan helper `app/util/date.ts` untuk tanggal/waktu umum dan `formatContentDate` di `app/util/content.ts` untuk workflow Asia/Jakarta. DateInput mengelola tanggal kalender YYYY-MM-DD. Helper locale dan navigation berada di util yang sama, bukan salinan dalam setiap halaman.

Periksa paritas key en/id dan render placeholder/interpolasi. Tambahkan terjemahan backend terpisah jika pesan server baru juga berubah; kedua kamus mempunyai tanggung jawab berbeda.
