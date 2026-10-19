# IG Flow — Aturan proyek frontend

Dashboard Nuxt untuk pengolahan konten Instagram AMTI dan review internal. Baca [overview](docs/project-overview.md), [konvensi kode](docs/coding-standards.md) dan panduan fitur sebelum perubahan. AGENTS.md dan CLAUDE.md harus identik.

## Stack dan struktur

Nuxt 4 SPA (SSR false), Nuxt UI 4, Tailwind CSS, TypeScript, Zod, Axios, Nuxt i18n en/id dan Bun. Versi mengikuti package.json/bun.lock. User dan Profile menjadi referensi struktur/visual. Contact sudah dihapus.

Page menyusun layout; component menangani UI; composable mengelola state/lifecycle; service menangani HTTP; helper stateless ada di app/util. Modul terkait tetap dikelompokkan per fitur, tanpa facade social. Jangan menduplikasi auth client, query builder, formatter atau shared component.

## UI dan bahasa

- Wajib gunakan Nuxt UI, token tema dan class Tailwind standar. Tidak memakai arbitrary values atau CSS hardcoded untuk meniru komponen yang tersedia.
- Tema primary biru AMTI, font Geist, default button/input lg. Rujuk app/app.config.ts dan app/assets/css/main.css; jangan ubah token global untuk memperbaiki satu halaman.
- Label, placeholder, toast, validation message dan aria-label memakai i18n di kedua locale. Baca docs/i18n-guide.md sebelum menambah teks.
- Form memakai UForm/Zod/UFormField; field wajib diberi required. Modal fitur menjadi component terpisah; gunakan DeleteModal bersama.
- Gunakan toast untuk hasil aksi. Error field/page/job yang perlu menetap dapat inline. Jangan menambah tombol refresh manual, role selector atau menu Contact.
- DateInput digunakan untuk tanggal. Formatter umum di util/date, formatter waktu workflow Asia/Jakarta di util/content.
- Gambar selain avatar dapat dibuka melalui shared lightbox. Gunakan UAvatar untuk avatar. Media memakai progressive preview dan MinIO; Blob sementara harus dibersihkan.
- Content menyatukan job/studio/review dalam tab status. Editor memakai UTabs pill primary. Media memakai infinite scroll, bukan pagination footer.

## API dan state

Plugin API adalah composition root. Jangan memanggil composable Nuxt atau request dari constructor service singleton. Service memakai apiService, requestHeaders dan ApiResponse dari app/types/api; tidak menampilkan toast/navigasi atau mengganti exception dengan undefined.

Ambil useServiceError saat setup sebelum await. Auth state readonly; pertahankan single refresh coordination dan jangan logout karena network error biasa. Gunakan useLatestRequest/polling sesuai lifecycle. Review/edit harus mempertahankan revision guard serta indikator preview outdated.

Semua user aktif memiliki akses yang sama. Callback secret hanya milik backend/n8n. Tidak ada credential AI/MinIO di frontend. READY_FOR_REVIEW langsung menuju PUBLISH atau REJECTED.

## Gaya kode dan verifikasi

Dua spasi, single quote, tanpa trailing comma; script setup TypeScript; import type untuk tipe. Component PascalCase, route/service kebab-case, composable camelCase berawalan use. Urutan script: import, macro/meta, composable, state, computed/schema, fungsi, watcher, lifecycle.

Untuk implementasi jalankan bun run typecheck, bun run lint, bun run test dan bun run build. Uji desktop/mobile bila browser tersedia dan laporkan batas verifikasi. Dokumentasi-only cukup pemeriksaan fakta/link; tidak perlu test yang menyalin teks dokumen. Update changelog untuk perubahan berarti.

Jangan install library jika Nuxt UI/Tailwind sudah mencukupi. Jangan ubah api-service, auth-service, layout, nuxt.config atau design tokens di luar scope permintaan. Jangan commit .env atau secret. Audit bertanggal adalah arsip, bukan acuan perilaku saat ini.

## Instagram publishing — 19 Oktober 2026

Publikasi Graph API memakai Instagram Login (graph.instagram.com, Instagram User access token, tanpa Facebook Page) melalui aksi eksplisit mendukung daftar multi-account, tetapi satu project hanya boleh diposting satu kali ke satu akun, langsung/terjadwal. Credential hanya di JSON privat server (bukan database); contoh tanpa secret boleh di-commit. Ready for review hanya mempunyai keputusan Publish atau Reject. Snapshot dan jadwal berada di tabel publications (migration tabel ke-14; constraint dan normalisasi ditambahkan pada migration 15–18). Worker posts:dispatch terpisah dari jobs:dispatch. Settings menampilkan daftar akun dan kontrol dispatcher AI. Jangan mengulang publish saat hasil jaringan ambigu; lakukan rekonsiliasi container.
